//jshint esversion:6
require('dotenv').config()
const  passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require('mongoose-findorcreate')
const bodyParser = require("body-parser");
const session = require('express-session')
const passport = require('passport')
const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");


const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


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


mongoose.connect("mongodb://127.0.0.1:27017/secretDB");

const secretSchema = new mongoose.Schema({
    email : {type : String },
    password :{ type : String },
    googleId: String,
    secret : String
  });


secretSchema.plugin(passportLocalMongoose);
secretSchema.plugin(findOrCreate);
const user = new  mongoose.model("user", secretSchema);
passport.use(user.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });

  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID:    process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // console.log(profile);
    user.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

app.get("/", function (req, res) {
    res.render("home")
});

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/secrets',
    passport.authenticate( 'google', {
        successRedirect: '/secrets',
        failureRedirect: '/login'
}));

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
app.get("/secrets", async function (req, res) {
    if (req.isAuthenticated()) {
        try {
            const foundUser = await user.find({ "secret": { $ne: null } }).exec();
            if (foundUser) {
                res.render("secrets", { userWithSecrets: foundUser });
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect("/login");
    }
});

app.get("/submit", function(req, res){
    if (req.isAuthenticated()) {
        res.render("submit");
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
app.post("/submit", function(req, res){
    const submittedSecret = req.body.secret;
   
    user.findById(req.user.id)
    .then(function (foundUser) {
        if(foundUser){
            foundUser.secret = submittedSecret;
            foundUser.save()
            .then(function(){
                res.redirect("secrets")
            })
        }
    })
    .catch(function(err){
        if(err){
            console.log(err);
        }
    })
})




app.listen( 3000 ,function () {
    console.log("app running on port 3000");
});