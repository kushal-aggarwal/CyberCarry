const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order"
        }
    ],
    contact: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    profilepic: Buffer,
    isadmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("user", userSchema);