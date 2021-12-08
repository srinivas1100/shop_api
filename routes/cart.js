const express = require("express");
const { verifyTokenAndAuthorization, verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const crypto = require("crypto-js");
const Cart = require("../models/Cart");

const router = express.Router();

//CREATE PRODUCT
router.post('/', verifyToken, async(req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).send(savedCart);
    } catch (error) {
        res.status(501).send(error);
    }
})

//UPDATE USER
router.put('/:id', verifyTokenAndAuthorization, async(req, res) => {

    try {
        const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).send(updateCart);
    } catch (e) {
        res.status(404).send("somthing wrong");
    }
})

// //DELETE PRODUCT
router.delete('/:id', verifyTokenAndAuthorization, async(req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).send("cart has been deleted..");
    } catch (e) {
        res.status(500).send("server error...");
    }
})

// GET USER CART
router.get('/find/:userId', verifyTokenAndAuthorization, async(req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).send(cart);
    } catch (e) {
        res.status(500).send("server error...");
    }
})

// GET ALL
router.get("/", verifyTokenAndAdmin, async(req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).send(carts);
    } catch (error) {
        res.status(500).send("error occured...")
    }
})

module.exports = router;