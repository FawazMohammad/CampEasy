var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
     //is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground){
                req.flash("error", "Campground doesn't exist");
                res.redirect("back");
            } else {
                //does user own this campground?
                if(foundCampground.author.id.equals(currentUser._id)){
                    next();
                } else {
                    //this is not your campground
                    req.flash("error", `Access Denied - You are not the author of ${foundCampground.name}`);
                    res.redirect("back");
                }                
            }
        });
    } else {
        req.flash("error", "You must be logged in to complete that action.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
     //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if (err || !comment){
                req.flash("error", "Comment doesn't exist");
                res.redirect("back");
            } else {
                //did user write this comment
                if(comment.author.id.equals(currentUser._id)){
                    next();
                } else {
                    //this is not your comment
                    req.flash("error", `Access Denied`);
                    res.redirect("back");
                }                
            }
        });
    } else {
        req.flash("error", "You must be logged in to complete that action.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to complete that action.");
    res.redirect("/login");
}


module.exports = middlewareObj;