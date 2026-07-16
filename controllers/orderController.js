const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const orderModel = require("../models/order-model");
const brevo = require("../utils/brevo");
const { generateToken } = require("../utils/generateToken");

module.exports.checkout = async function(req, res) {
    let user = req.user;
    await user.populate("cart.product");
    let totalMRP = user.cart.reduce(function(total, item) {
        return total + (item.product.price)*(item.quantity);
    }, 0);
    let totalDiscount = user.cart.reduce(function(total, item) {
        return total + (item.product.discount)*(item.quantity);
    }, 0);
    let platformFee = 20;
    let totalAmount = totalMRP - totalDiscount + platformFee;
    res.render("checkout", { user, totalMRP, totalDiscount, totalAmount, platformFee });
}

module.exports.payment = async function(req, res) {
    let user = req.user;

    await user.populate("cart.product");

    let totalMRP = user.cart.reduce(function(total, item) {
        return total + item.product.price * item.quantity;
    }, 0);
    let totalDiscount = user.cart.reduce(function(total, item) {
        return total + item.product.discount * item.quantity;
    }, 0);
    let platformFee = 20;
    let totalAmount = totalMRP - totalDiscount + platformFee;

    res.render("payment", { user, totalMRP, totalDiscount, platformFee, totalAmount });
}

module.exports.placeOrder = async function(req, res) {
    let user = req.user;
    await user.populate("cart.product");
    
    if(user.cart.length === 0) {
        return res.redirect("/cart");
    }

    let totalMRP = user.cart.reduce(function(total, item) {
        return total + item.product.price * item.quantity;
    }, 0);
    let totalDiscount = user.cart.reduce(function(total, item) {
        return total + item.product.discount * item.quantity;
    }, 0);
    let platformFee = 20;
    let totalAmount = totalMRP - totalDiscount + platformFee;

    let items = user.cart.map(function(item) {
        return {
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            discount: item.product.discount,
            quantity: item.quantity
        };
    });

    let order = await orderModel.create({
        user: user._id,
        items,
        totalMRP,
        totalDiscount,
        platformFee,
        totalAmount,
        deliveryAddress: user.address,
        paymentMethod: req.body.paymentMethod
    });

    user.orders.push(order._id);
    user.cart = [];
    await user.save();

    console.log("Reached Brevo");

    try {
        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: "CyberCarry",
                email: process.env.BREVO_EMAIL
            },
            to: [
                {
                    email: user.email,
                    name: user.fullname
                }
            ],
            subject: "Order Placed!",
            htmlContent: `
                <div style="max-width:600px;margin:auto;background:#ffffff;font-family:Arial,sans-serif;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    
                    <div style="background:#ec4899;padding:24px;text-align:center;color:white;">
                        <h1 style="margin:0;">CyberCarry</h1>
                        <p style="margin:8px 0 0;">Your order has been placed successfully 🎉</p>
                    </div>
    
                    <div style="padding:32px;">
    
                        <p>Hi <strong>${user.fullname}</strong>,</p>
    
                        <p>
                            Thank you for shopping with CyberCarry! We've received your order and it's now being processed.
                        </p>
    
                        <div style="background:#fdf2f8;padding:18px;border-radius:10px;margin:24px 0;">
                            <p style="margin:6px 0;"><strong>Order ID:</strong> ${order._id}</p>
                            <p style="margin:6px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                            <p style="margin:6px 0;"><strong>Order Status:</strong> ${order.orderStatus}</p>
                        </div>
    
                        <h3 style="margin-bottom:14px;">Items Ordered</h3>
    
                        <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
    
                            ${order.items.map(item => `
                                <tr>
                                    <td style="border-bottom:1px solid #eeeeee;">
                                        ${item.name}
                                    </td>
    
                                    <td align="center" style="border-bottom:1px solid #eeeeee;">
                                        ×${item.quantity}
                                    </td>
    
                                    <td align="right" style="border-bottom:1px solid #eeeeee;">
                                        ₹${(item.price-item.discount)*item.quantity}
                                    </td>
                                </tr>
                            `).join("")}
    
                        </table>
    
                        <div style="margin-top:28px;">
    
                            <table width="100%">
    
                                <tr>
                                    <td>Total MRP</td>
                                    <td align="right">₹${order.totalMRP}</td>
                                </tr>
    
                                <tr>
                                    <td>Discount</td>
                                    <td align="right">-₹${order.totalDiscount}</td>
                                </tr>
    
                                <tr>
                                    <td>Platform Fee</td>
                                    <td align="right">₹${order.platformFee}</td>
                                </tr>
    
                                <tr style="font-size:18px;font-weight:bold;">
                                    <td style="padding-top:12px;">Total</td>
                                    <td align="right" style="padding-top:12px;color:#ec4899;">
                                        ₹${order.totalAmount}
                                    </td>
                                </tr>
    
                            </table>
    
                        </div>
    
                        <div style="margin-top:30px;">
                            <strong>Delivery Address</strong>
    
                            <p style="margin-top:8px;white-space:pre-line;">${order.deliveryAddress}</p>
                        </div>
    
                        <p style="margin-top:32px;">
                            Thanks for shopping with us 🕶️
                        </p>
    
                        <p style="margin-top:28px;color:#6b7280;line-height:1.6;">
                            Need help with your order?
                            <br>
                            Reach out to us anytime at
                            <strong>${process.env.SUPPORT_EMAIL || process.env.MAIL_ID}</strong>.
                        </p>
    
                    </div>
    
                    <div style="background:#111827;padding:24px;text-align:center;">
    
                        <div style="font-size:24px;font-weight:bold;color:white;">
                            CyberCarry
                        </div>
    
                        <div style="margin-top:8px;color:#d1d5db;">
                            Built by <strong>CyberForge</strong> with Cyber...ness?
                        </div>
    
                        <div style="margin-top:18px;font-size:13px;color:#9ca3af;line-height:1.6;">
                            This is an automated email generated by CyberCarry.
                            <br>
                            Please do not reply directly to this message.
                        </div>
    
                        <div style="margin-top:18px;font-size:13px;color:#6b7280;">
                            © ${new Date().getFullYear()} CyberCarry. All rights reserved.
                        </div>
    
                    </div>
    
                </div>
                `
        });
    
        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: "CyberCarry",
                email: process.env.BREVO_EMAIL
            },

            to: [
                {
                    email: process.env.MAIL_ID
                }
            ],

            subject: "New Order Received",
            htmlContent: `
            <div style="max-width:650px;margin:auto;font-family:Arial,sans-serif;background:white;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
                <div style="background:#111827;padding:30px;text-align:center;color:white;">
                    <h1 style="margin:0;">🛒 New Order Received</h1>
                </div>
    
                <div style="padding:35px;">
    
                    <div style="background:#f9fafb;padding:22px;border-radius:12px;margin-bottom:28px;">
                        <h2 style="margin-top:0;">Customer Details</h2>
    
                        <p><strong>Name:</strong> ${user.fullname}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Contact:</strong> ${user.contact}</p>
                        <p><strong>Address:</strong><br>${order.deliveryAddress}</p>
                    </div>
    
                    <div style="background:#fdf2f8;padding:22px;border-radius:12px;margin-bottom:28px;">
                        <h2 style="margin-top:0;">Order Details</h2>
    
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                        <p><strong>Status:</strong> ${order.orderStatus}</p>
    
                        <hr style="border:none;border-top:1px solid #fbcfe8;margin:18px 0;">
    
                        ${order.items.map(item => `
                            <div style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                                <strong>${item.name}</strong><br>
                                Qty: ${item.quantity}<br>
                                ₹${item.price - item.discount} each
                            </div>
                        `).join("")}
    
                        <hr style="border:none;border-top:1px solid #fbcfe8;margin:18px 0;">
    
                        <p><strong>Total MRP:</strong> ₹${order.totalMRP}</p>
                        <p><strong>Discount:</strong> ₹${order.totalDiscount}</p>
                        <p><strong>Platform Fee:</strong> ₹${order.platformFee}</p>
    
                        <h2 style="margin-bottom:0;color:#ec4899;">
                            Total Order Value: ₹${order.totalAmount}
                        </h2>
                    </div>
    
                </div>
    
                <div style="background:#111827;color:white;text-align:center;padding:18px;font-size:13px;">
                    CyberCarry Admin Notification
                </div>
            </div>
            `
        });
    }
    catch (err) {
    console.log("========== BREVO ERROR ==========");

    console.dir(err, { depth: null });

    if (err.response) {
        console.log("STATUS:", err.response.status);
        console.dir(err.response.data, { depth: null });
    }

    console.log("================================");
}

    res.redirect("/orders/success/" + order._id);
}