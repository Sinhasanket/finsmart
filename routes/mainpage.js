var express = require("express");
var router  = express.Router();
var Money = require("../models/money");
var middleware = require("../middleware");


//INDEX - show all
router.get("/", function(req, res){
    // Get all from DB
    Money.find({}, function(err, allMoney){
       if(err){
           console.log(err);
       } else {
          res.render("mainpage/index",{money:allMoney});
       }
    });
});

//CREATE - add new to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newMoney = {name: name, image: image, description: desc, author:author}
    // Create new  and save to DB
    Money.create(newMoney, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to page
            console.log(newlyCreated);
            res.redirect("/mainpage");
        }
    });
});

//NEW - show form to create new 
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("mainpage/new"); 
});

// SHOW - shows more info about one 
router.get("/:id", function(req, res){
    //find  with provided ID
    Money.findById(req.params.id).populate("comments").exec(function(err, foundMoney){
        if(err){
            console.log(err);
        } else {
            console.log(foundMoney)
            //render show template with that
            res.render("mainpage/show", {money: foundMoney});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkMoneyOwnership, function(req, res){
    Money.findById(req.params.id, function(err, foundMoney){
        res.render("mainpage/edit", {money: foundMoney});
    });
});

// UPDATE  ROUTE
router.put("/:id",middleware.checkMoneyOwnership, function(req, res){
    // find and update the correct 
    Money.findByIdAndUpdate(req.params.id, req.body.money, function(err, updatedMoney){
       if(err){
           res.redirect("/mainpage");
       } else {
           //redirect somewhere(show page)
           res.redirect("/mainpage/" + req.params.id);
       }
    });
});

// DESTROY  ROUTE
router.delete("/:id",middleware.checkMoneyOwnership, function(req, res){
   Money.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/mainpage");
      } else {
          res.redirect("/mainpage");
      }
   });
});


module.exports = router;
