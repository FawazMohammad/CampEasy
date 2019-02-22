var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    //Get all campgounds from DB
    
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, page: 'campgrounds'});
        }
    })
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
     //get data from form and create campgound
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}

    //create a new campgound and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "Campground created");
            res.redirect("/campgrounds");
        }
    });
});

//NEW - form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


//SHOW - show more info about one campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err || !foundCampground){
           req.flash("error", "Campground doesn't exist")
           res.redirect("back");
       } else {
           //render show template
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });

});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
                res.render("campgrounds/edit", {campground: foundCampground});
        }); 
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Couldn't Update Campground");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
});


// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, removedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            Comment.deleteMany( {_id: { $in: removedCampground.comments } }, function(err){
               if (err) {
                console.log(err);
                } 
            });
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
            
        }
    });
});




module.exports = router;