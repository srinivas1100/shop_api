const app = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY)
const router = app.Router();

router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "inr",
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).send("stripe error")
        } else {
            res.status(200).send(stripeRes)
        }
    })
})

module.exports = router;