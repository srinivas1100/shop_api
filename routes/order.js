const express = require("express");
const { verifyTokenAndAuthorization, verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const crypto = require("crypto-js");
const Order = require("../models/Order");

const router = express.Router();

//CREATE ORDER
router.post('/', verifyToken, async(req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).send(savedOrder);
    } catch (error) {
        res.status(501).send(error);
    }
})

//UPDATE ORDER
router.put('/:id', verifyTokenAndAdmin, async(req, res) => {

    try {
        const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).send(updateOrder);
    } catch (e) {
        res.status(404).send("somthing wrong");
    }
})

// //DELETE ORDER
router.delete('/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).send("Order has been deleted..");
    } catch (e) {
        res.status(500).send("server error...");
    }
})

// GET USER ORDER
router.get('/find/:userId', verifyTokenAndAuthorization, async(req, res) => {
    try {
        const order = await Order.find({ userId: req.params.userId });
        res.status(200).send(order);
    } catch (e) {
        res.status(500).send("server error...");
    }
})

// GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async(req, res) => {
    try {
        const order = await Order.find();
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send("error occured...")
    }
})

// GET MONTHLLY INCOME
router.get('/income', verifyTokenAndAdmin, async(req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const preMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: preMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },

        ]);
        res.status(200).send(income);
    } catch (error) {
        res.status(500).send(err);
    }
})

module.exports = router;