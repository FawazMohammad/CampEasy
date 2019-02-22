var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");
    
router.get("/", function(req, res){
    res.render("landing");
});

//show register form 
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

//handle registration
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error":err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", `Welcome to CampEasy, ${user.username}!`);
            res.redirect("/campgrounds");
        });
    });
});


//show login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

//handle login
//app.post(route,middleware,callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    
    }), function(req, res){
});


//logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully Logged Out!")
    res.redirect("/campgrounds");
});


module.exports = router;