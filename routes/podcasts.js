var express     = require("express");
var router      = express.Router();
var Podcast  = require("../models/podcast");
var middleware  = require("../middleware");
var Review      = require("../models/review");

// Index Route - show all podcasts
router.get("/", function(req, res){
    // Get all podcasts from DB
    Podcast.find({}, function(err, allPodcasts){
       if(err){
           console.log(err);
       } else {
          res.render("podcasts/index",{podcasts:allPodcasts});
       }
    });
});

// Create Route - add new podcast to database
router.post("/", middleware.isLoggedIn, function(req, res){
    // Get data from form and add to podcasts array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPodcast = {name: name, image: image, description: desc, author: author, price: price};
    // Create a new podcast and save to DB
    Podcast.create(newPodcast, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // Redirect back to podcasts page
            res.redirect("/podcasts");
        }
    });
});

// New Route - show form to create new podcast
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("podcasts/new.ejs"); 
});

// Show Route - shows more info about one podcast
router.get("/:id", function (req, res) {
    //find the podcast with provided ID
    Podcast.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundPodcast) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that podcast
            res.render("podcasts/show", {podcast: foundPodcast});
        }
    });
});

// Edit Route
router.get("/:id/edit", middleware.checkPodcastOwnership, function(req, res) {
    Podcast.findById(req.params.id, function(err, foundPodcast) {
        res.render("podcasts/edit", {podcast: foundPodcast});
    });
});


// Update Route
router.put("/:id", middleware.checkPodcastOwnership, function(req, res) {
    Podcast.findByIdAndUpdate(req.params. id, req.body.podcast, function(err, updatedPodcast) {
        if(err) {
            res.redirect("/podcasts");
        } else {
            res.redirect("/podcasts/" + req.params.id);
        }
    delete req.body.podcast.rating;    
    });
    
});

// Destroy Route 
router.delete("/:id", middleware.checkPodcastOwnership, function (req, res) {
    Podcast.findById(req.params.id, function (err, podcast) {
        if (err) {
            res.redirect("/podcats");
        } else {
            // deletes all comments associated with the podcast
            Comment.remove({"_id": {$in: podcast.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/podcasts");
                }
                // deletes all reviews associated with the podcast
                Review.remove({"_id": {$in: podcast.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/podcasts");
                    }
                    //  delete the podcast
                    podcast.remove();
                    req.flash("success", "Podcast deleted successfully!");
                    res.redirect("/podcasts");
                });
            });
        }
    });
});

module.exports = router;