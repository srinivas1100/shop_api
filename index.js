const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require("cors");

const app = express();
dotenv.config();
app.use(cors())

const userRoute = require("../server/routes/auth");
const updateRoute = require("../server/routes/user");
const productRoute = require("../server/routes/product");
const cartRoute = require("../server/routes/cart");
const orderRoute = require("../server/routes/order");
const stripeRoute = require("../server/routes/stripe");


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("db connection successfull")
}).catch((e) => {
    console.log(e);
});


app.use(express.json())
app.use('/api/auth', userRoute);
app.use('/api/auth', updateRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);
app.use("/api/checkout", stripeRoute);


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server running")
})