const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const isloggedin = require("../middlewares/isLoggedIn");
const isadmin = require("../middlewares/isAdmin");

if(process.env.NODE_ENV === "development") {
    router.post("/create", async function(req, res) {
        let owners = await ownerModel.find();
        if(owners.length > 0) {
            return res.status(503).send("You don't have the permission to create a new Owner");
        }

        let {fullname, email, password} = req.body;

        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password
        });
        
        res.status(201).send(createdOwner);
    });
}

router.get("/admin", isloggedin, isadmin, function(req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success }); 
})

module.exports = router;