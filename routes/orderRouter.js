const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const orderModel = require("../models/order-model");
const isloggedin = require("../middlewares/isLoggedIn");
const upload = require("../config/multer-config");
const { checkout, payment, placeOrder } = require("../controllers/orderController");

router.get("/checkout", isloggedin, checkout);

router.post("/checkout", isloggedin, function(req, res) {
    res.render("checkout", { user: req.user });
});

router.get("/", isloggedin, async function(req, res) {
    let user = req.user;
    await user.populate({
        path: "orders",
        options: {
            sort: { createdAt: -1 }
        }
    });
    res.render("orders", { orders: user.orders });
});

router.post("/payment", isloggedin, payment);

router.post("/place", isloggedin, placeOrder);

router.get("/success/:orderid", isloggedin, async function(req, res) {
    let order = await orderModel.findById(req.params.orderid);
    res.render("success", { order });
});

router.get("/:orderid", isloggedin, async function(req, res) {
    let order = await orderModel.findById(req.params.orderid);
    res.render("orderDetails", { order });
});

module.exports = router;