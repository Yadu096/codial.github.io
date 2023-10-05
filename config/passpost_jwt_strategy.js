const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const opts= {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Codial'
};

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){

    //Find the user using jwt payload
    User.findById(jwtPayLoad).then((user)=>{
        if(user!=undefined){
            return done(null, user);
        }
        return done(null, false);
    }).catch((err)=>{
        console.log(err, " Error in finding user from JWT");
        return;
    });
}));


module.exports = passport;