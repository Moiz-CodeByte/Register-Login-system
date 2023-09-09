//jshint esversion:6
require('dotenv').config()
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require('bcrypt');
const ejs = require("ejs");


const app = express();
const saltRounds = 10;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use( bodyParser.urlencoded({ extended: true}));

mongoose.connect("mongodb://127.00.1:27017/secretDB");

const secretSchema = new mongoose.Schema({
    email : {type : String,
    required: [ true, "Please enter email.." ]  },
    password :{ type : String ,
      required: [ true, "please add password" ] },
  });
  
 
 // secretSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});
  const user = new  mongoose.model("user", secretSchema);
app.get("/", function (req, res) {
    res.render("home")
});

app.get("/login", function (req, res) {
    res.render("login")
});

app.get("/register", function (req, res) {
    res.render("register")
});
app.post("/register" , function (req, res) {
bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new user({
        email    : req.body.username,
        password : hash
    })
   

    newUser.save()
    .then(function() {
        res.render("secrets");
      })
      .catch(function (err) {
        console.error(err);
      });
    });
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
  
    user.findOne({email : username})
    .then(function(userFound) {
        if(userFound){
            bcrypt.compare(password, userFound.password, function(err, result) {
                if(result === true){
                    
                        res.render('secrets')

                    }
                    else{
                        res.send('wrong credentials');
                    }
                    })
                }
                })
    .catch(function(err){
        res.send(err);
    })
})




app.listen( 3000 ,function () {
    console.log("app running on port 3000");
});