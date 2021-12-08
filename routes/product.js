const express = require("express");
const { verifyTokenAndAuthorization, verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const crypto = require("crypto-js");
const Product = require("../models/Product");

const router = express.Router();

//CREATE PRODUCT
router.post('/', verifyTokenAndAdmin, async(req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).send(newProduct);
    } catch (error) {
        res.status(501).send(error);
    }
})

//UPDATE USER
router.put('/:id', verifyTokenAndAdmin, async(req, res) => {

    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).send(updateProduct);
    } catch (e) {
        res.status(404).send("somthing wrong");
    }
})

// //DELETE PRODUCT
router.delete('/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("product has been deleted..");
    } catch (e) {
        res.status(500).send("server error...");
    }
})

// GET SINGLE PRODUCT
router.get('/find/:id', async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).send(product);
    } catch (e) {
        res.status(500).send("server error...");
    }
})

//GET ALL USERS
router.get('/', async(req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            })
        } else {
            products = await Product.find();
        }
        res.status(200).send(products);
    } catch (e) {
        res.status(500).send("server error...");
    }
});


module.exports = router;