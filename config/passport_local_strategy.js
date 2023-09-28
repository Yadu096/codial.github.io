const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

console.log("Local strategy called");


//Authenticating using local strategy
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){
        //Find a user and establish identity
        User.findOne({email: email}).then((user)=>{
            if(!user || user.password != password){
                console.log("Invalid Username/Password");
                return done(null, false);
            }

            return done(null, user);
        }).catch((err)=>{
            if(err){
                console.log("Error occured in finding the user"); 
                return done(err);
            };
        }) 
    }
));

//Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    // console.log("serializer called");
    return done(null, user.id);
});

//Deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    // console.log("deserializer called");

    //Find the user with the id
    User.findById(id).then((user)=>{
        //return the user
        return done(null, user);
    }).catch((err)=>{
        console.log("Error in finding the user");
        return done(err);
    }); 
});



passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //If the user is authenticated, request will have the user, so we need to pass it to the response locals
        res.locals.user = req.user;
    }

    next();
}

//Create a check authentication function on passport to check if the user is signed in or not.
passport.checkAuthentication = function(req, res, next){
    //If the user is authenticated, pass on the user to the next function
    if(req.isAuthenticated()){
       return next();
    }

    //If the user is not authenticated 
    return res.redirect('http://localhost:8000/user/sign-in');
}

module.exports = passport;

// var express = require('express');
// var passport = require('passport');
// var LocalStrategy = require('passport-local');
// var crypto = require('crypto');
// var db = require('../models/user');

// passport.use(new LocalStrategy(function verify(username, password, cb) {
//     db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
//       if (err) { return cb(err); }
//       if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
  
//       crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//         if (err) { return cb(err); }
//         if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
//           return cb(null, false, { message: 'Incorrect username or password.' });
//         }
//         return cb(null, row);
//       });
//     });
//   }));

//   passport.serializeUser(function(user, cb) {
//     process.nextTick(function() {
//       cb(null, { id: user.id, username: user.username });
//     });
//   });
  
//   passport.deserializeUser(function(user, cb) {
//     process.nextTick(function() {
//       return cb(null, user);
//     });
//   });


