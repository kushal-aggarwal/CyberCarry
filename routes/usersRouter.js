const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const isloggedin = require("../middlewares/isLoggedIn");
const upload = require("../config/multer-config");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const { account } = require("../controllers/userController");

router.get("/", function(req, res){
    res.send("hey"); 
})

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/account", isloggedin, async function(req, res) {
    res.render("account", { user: req.user, redirect: req.query.redirect });
});

router.post("/account", isloggedin, upload.single("profilepic"), account);

module.exports = router;