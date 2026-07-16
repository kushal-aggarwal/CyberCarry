const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const productModel = require("../models/product-model");
const isloggedin = require("../middlewares/isLoggedIn");

router.get("/", function(req, res) {
    let error = req.flash("error");
    res.render("index", { error, isloggedin: false }); 
});

router.get("/shop", isloggedin, async function(req, res) {
    let products = await productModel.find();

    if(req.query.sortby === "priceAsc") {
        products.sort(function(a, b) {
            return a.price - b.price;
        });
    }

    if(req.query.sortby === "priceDesc") {
        products.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    let success = req.flash("success");
    res.render("shop", { products, success, sortby: req.query.sortby });
});

router.get("/cart", isloggedin, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    await user.populate("cart.product");
    let totalMRP = user.cart.reduce(function(total, item) {
        return total + (item.product.price)*(item.quantity);
    }, 0);
    let totalDiscount = user.cart.reduce(function(total, item) {
        return total + (item.product.discount)*(item.quantity);
    }, 0);
    let platformFee = 20;
    let totalAmount = totalMRP - totalDiscount + platformFee;
    res.render("cart", { user, totalMRP, totalDiscount, totalAmount });
});

router.get("/addtocart/:productid", isloggedin, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    let existingItem  = user.cart.find(function(item) {
        return item.product.equals(req.params.productid);
    });
    if(existingItem) {
        existingItem.quantity++;
    }
    else {
        user.cart.push({
            product: req.params.productid,
            quantity: 1
        });
    }
    await user.save();
    req.flash("success", "Added To Cart");
    res.redirect("/" + req.query.redirect);
});

router.get("/removefromcart/:productid", isloggedin, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    let index = user.cart.findIndex(function(item) {
        return item.product.equals(req.params.productid);
    });
    if(index === -1) {
        return res.redirect("/cart");
    }
    else {
        if(user.cart[index].quantity > 1) {
            user.cart[index].quantity--;
        }
        else {
            user.cart.splice(index, 1);
        }
    }
    await user.save();
    req.flash("success", "Cart Updated");
    res.redirect("/" + req.query.redirect);
});

router.get("/test-gmail", async (req, res) => {
    try {
        await transporter.sendMail({
            from: `"CyberCarry" <${process.env.MAIL_ID}>`,
            to: process.env.MAIL_ID,
            subject: "SMTP Test",
            html: "<h1>SMTP works 🎉</h1>"
        });

        res.send("Sent!");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;