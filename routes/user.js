const express = require("express");
const { verifyTokenAndAuthorization, verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const crypto = require("crypto-js");
const User = require("../models/User");

const router = express.Router();

//UPDATE USER
router.put('/:id', verifyTokenAndAuthorization, async(req, res) => {
    if (req.body.password) {
        req.body.password = crypto.AES.encrypt(
            req.body.password,
            process.env.SEC_PAS
        ).toString()
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).send(updateUser);
    } catch (e) {
        res.status(404).send("your not allowed");
    }
})

//DELETE USER
router.delete('/:id', verifyTokenAndAuthorization, async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send("user has been deleted..");
    } catch (e) {
        res.status(500).send("server error...");
    }
})

//GET USERS
router.get('/find/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).send(others);
    } catch (e) {
        res.status(500).send("server error...");
    }
})

//GET ALL USERS
router.get('/find', verifyTokenAndAdmin, async(req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(3) : await User.find();
        res.status(200).send(users);
    } catch (e) {
        res.status(500).send("server error...");
    }
});

//GET USER count
router.get("/stats", verifyTokenAndAdmin, async(req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ])
        res.status(200).send(data)
    } catch (e) {
        console.log(e);
        res.status(400).send("somthing wrong");
    }
});


module.exports = router;