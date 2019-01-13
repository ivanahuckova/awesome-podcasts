var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var middleware  = require("../middleware");

// Root Route
router.get("/", function(req, res){
    res.render("landing");
});

// Register Form Route
router.get("/register", function(req, res) {
    res.render("register");
});

// Handle SignUp Logic Route
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
      if(err) {
          return res.render("register", {"error":err.message});
      }  
      passport.authenticate("local")(req, res, function() {
          req.flash("success", "Welcome " + user.username +"!");
          res.redirect("/podcasts");
      });
    });
});

// Show LogIn Form Route
router.get("/login", function(req, res) {
    res.render("login");
});

// Handle LogIn Logic Route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/podcasts",
        failureRedirect: "/login"
    }), function(req, res) {
});

// LogOut Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/podcasts");
});


module.exports = router;