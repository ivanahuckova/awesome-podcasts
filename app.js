var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    Podcast             = require("./models/podcast"),
    Comment             = require("./models/comment"),
    User                = require("./models/user");

// Requiring Routes
var commentRoutes       = require("./routes/comments"),
    reviewRoutes        = require("./routes/reviews"),
    podcastRoutes       = require("./routes/podcasts"),
    indexRoutes         = require("./routes/index");

    
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configurations
app.use(require("express-session")({
    secret: "Podcast12345",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/podcasts", podcastRoutes);
app.use("/podcasts/:id/comments", commentRoutes);
app.use("/podcasts/:id/reviews", reviewRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Awesome Podcasts Server Has Started!");
});