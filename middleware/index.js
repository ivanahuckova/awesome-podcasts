var Podcast  = require("../models/podcast");
var Comment     = require("../models/comment");
var Review      = require("../models/review");

var middlewareObj = {};

middlewareObj.checkPodcastOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Podcast.findById(req.params.id, function(err, foundPodcast) {
            if(err) {
                req.flash("error", "Podcast not found");
                res.redirect("back");
            } else {
                if (!foundPodcast) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back")
                }
                // Does user own the podcast?
                if(foundPodcast.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    } 
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                
                if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back")
                }
                
                // Does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                next();
                } else {
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
    
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Podcast.findById(req.params.id).populate("reviews").exec(function (err, foundPodcast) {
            if (err || !foundPodcast) {
                req.flash("error", "Podcast not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundPodcast.reviews
                var foundUserReview = foundPodcast.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("back");
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;