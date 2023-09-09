//jshint esversion:6
require('dotenv').config()
const  passportLocalMongoose = require("passport-local-mongoose")
const bodyParser = require("body-parser");
const session = require('express-session')
const passport = require('passport')
const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use( bodyParser.urlencoded({ extended: true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    
  }));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://127.00.1:27017/secretDB");

const secretSchema = new mongoose.Schema({
    email : {type : String },
    password :{ type : String },
  });

secretSchema.plugin(passportLocalMongoose);
const user = new  mongoose.model("user", secretSchema);
passport.use(user.createStrategy());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.get("/", function (req, res) {
    res.render("home")
});

app.get("/login", function (req, res) {
    res.render("login")
});
app.get("/logout", function (req, res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    })
  

app.get("/register", function (req, res) {
    res.render("register")
});
app.get("/secrets", function(req, res){
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.post("/register" , function (req, res) {
    user.register({username : req.body.username, active: false}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register")
         }
         else{
            passport.authenticate("local")(req,res,function(){
                  res.redirect("/secrets")       
            })
         }
    
      });
})

app.post("/login", function(req, res){
  
    const User = new user({
        username : req.body.username,
        password : req.body .password
    })
    req.login(User, function(err){
        if(err){
            console.log(err)
        }
        else{
            passport.authenticate("local")(req,res,function() {
                res.redirect("/secrets");
            })
        }
    })
  });





app.listen( 3000 ,function () {
    console.log("app running on port 3000");
});