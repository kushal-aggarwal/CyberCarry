module.exports = function(req, res, next) {

    if(!req.user.isadmin) {
        req.flash("error", "Unauthorized Access");
        return res.redirect("/shop");
    }

    next();

}