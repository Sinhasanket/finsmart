var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/users");

router.get("/", function(req, res){
   res.render("home"); 
});

router.get("/index", isLoggedin, function(req, res){
   res.render("mainpage/index");
});

router.get("/register", function(req, res){
   res.render("register");
});

router.post("/register", function(req,res){
   req.body.username
   req.body.password
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
         console.log(err);
         return res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
         res.redirect("/index");
      });
   });
});

router.get("/login", function(req, res){
   res.render("login");
});

router.post("/login", passport.authenticate("local" ,{
   successRedirect: "/index",
   failureRedirect: "/login"
}), function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedin(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   res.redirect("/login");
}

module.exports = router;