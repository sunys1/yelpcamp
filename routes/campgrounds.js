var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                    console.log(err);
            }else{
                    res.render("campgrounds/index", ({campgrounds: allCampgrounds, currentUser: req.user}));
            }
        })
})

router.post("/", isLoggedIn, function(req, res){
            //get data from form and add to campgrounds array
            //redirect back to camgrounds page
            var name = req.body.name;
            var price = req.body.price;
            var image = req.body.image;
            var description = req.body.description;
            var author = {
                       id: req.user._id,
                       username: req.user.username
            };
            var newCampground = {name: name, price: price, image: image, description: description, author: author};
            //create a new campground and save to database
            Campground.create(newCampground, function(err, campground){
                  if(err){
                         console.log(err);
                  }else{
                         //redirect back to campgrounds page     
                         res.redirect("/campgrounds");
                  }
            })
})
//New - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
            res.render("campgrounds/new");
})

//Show more info about one campground
router.get("/:id", function(req, res){
       //find the campgroud with provided ID
       
       Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if(err || !foundCampground){
                    req.flash("error", "Campground not found");
                    res.redirect("back");
            }else{  //render show template with that campgrounds
                    // console.log(foundCampground);
                    res.render("campgrounds/show", {campground: foundCampground});
            }
       });
})
function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect("/login");
        }
}
// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});
// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    //redirect back to show page
})

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;