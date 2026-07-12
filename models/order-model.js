const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    items: [
        {
            name: String,
            image: Buffer,
            price: Number,
            discount: Number,
            quantity: Number
        }
    ],
    totalMRP: Number,
    totalDiscount: Number,
    platformFee: Number,
    totalAmount: Number,
    deliveryAddress: String,
    orderStatus: {
        type: String,
        default: "Placed"
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "UPI"]
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("order", orderSchema);