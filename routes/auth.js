const express = require("express");
const User = require("../models/User")
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

const router = express.Router();


//RIGISTER
router.post('/register', async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: crypto.AES.encrypt(req.body.password, process.env.SEC_PAS).toString(),
    });

    try {
        const user = await newUser.save();
        console.log(user);
        res.status(200).send(user)
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
})

//LOGIN
router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
        });
        !user && res.status(401).send("no user found");
        const hashedpassword = crypto.AES.decrypt(user.password, process.env.SEC_PAS);
        const Originalpassword = hashedpassword.toString(crypto.enc.Utf8);

        const accessToken = jwt.sign({
                id: user._id,
                admin: user.admin,
            },
            process.env.JWT_SEC, { expiresIn: "1000000000d" }
        )

        const { password, ...others } = user._doc;

        Originalpassword !== req.body.password ? res.status(401).send("you entered a wrong password") :

            res.status(200).send({...others, accessToken })
    } catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})

module.exports = router;