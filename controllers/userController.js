const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generateToken");

module.exports.account = async function(req, res) {
    let user = req.user;
    if(req.body) {
        user.contact = req.body.contact;
        user.email = req.body.email;
        user.fullname = req.body.fullname;
        user.address = req.body.address;
    }
    if(req.file) {
        user.profilepic = req.file.buffer;
    }
    await user.save();
    if(req.query.redirect) {
        return res.redirect("/orders/" + req.query.redirect);
    }
    return res.redirect("/users/account");
}