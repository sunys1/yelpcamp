var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    Campground          = require("./models/campground"),
    methodOverride      = require("method-override"),
    User                = require("./models/user"),
    seedDB              = require("./seeds"),
    Comment             = require("./models/comment");
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

//mongodb://localhost:27017/yelp_camp
mongoose.connect(process.env.DATABASEURL);
//"mongodb://sunys:sunxiaomao38@ds143738.mlab.com:43738/yelpcamp1"
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());
app.use(express.static(__dirname + "/public"))
//seedDB(); //seed the database

//Passport configuration
app.use(require("express-session")({
       secret: "Take this as a secret between us!",
       resave: false,
       saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error     = req.flash("error");
    res.locals.success   = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has started!!"); 
})
