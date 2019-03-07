var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    localstrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    User                  = require("./models/users"),
    Comment               = require("./models/comment"),
    Money                 = require("./models/money"),
    passportLocalMongoose = require("passport-local-mongoose");
     
var commentRoutes    = require("./routes/comments"),
    mainpageRoutes   = require("./routes/mainpage"),
    indexRoutes      = require("./routes/index")
       
mongoose.connect("mongodb://localhost/finsmart");
       
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
   secret: "something",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRoutes);
app.use("/mainpage", mainpageRoutes);
app.use("/mainpage/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server is on"); 
});