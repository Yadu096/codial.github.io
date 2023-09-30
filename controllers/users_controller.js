const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');

module.exports.signup = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }

    return res.render('user_sign_up', {
        title: "Sign Up"
    });
}

module.exports.signin = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }

    return res.render('user_sign_in', {
        title: "Sign In"
    });
}

module.exports.profile = function(req, res){

    return res.render('user_profile',{
        title: "Profile Page"
    });

    // if(req.cookies.user_id){

    //     User.findOne({_id: req.cookies.user_id}).then((user)=>{
    //         res.cookie('user_id', );
    //         return res.render('user_profile', {
    //             title: "User Profile",
    //             user_details: user
    //         });
    //     }).catch((err)=>{
    //         console.log(err, " Error occured in fetching the user, redirecting to the sign in page");
    //         return res.redirect('/user/sign-in');
    //     })

    // }else{
    //     console.log("Please sign in again");
    //     return res.redirect('/user/sign-in');
    // }    
}

module.exports.createUser = function(req, res){
    //Check if password and confirm password are same
    if(req.body.Password != req.body.Confirm_Password){
        console.log("Passwords don't match");
        return res.redirect('back');
    };
    //Check if user already exists
    User.findOne({email: req.body.Email}).then((user)=>{
        //If returned value of user is undefined that means user does not exist and hence create the user
        if(user==undefined){
            //Create the user
            User.create({
                email: req.body.Email,
                password: req.body.Password,
                name: req.body.Name,
                age: req.body.Age,
                gender: req.body.Gender
            }).then((user)=>{
                console.log(user);
                return res.redirect('http://localhost:8000/user/sign-in');
            }).catch((err)=>{
                console.log(err, "Error in creating the user"); 
                return res.redirect('back');
            });
            
        }else{
            console.log(user, " User already exists, redirecting to sign in page");
            return res.redirect('http://localhost:8000/user/sign-in');
        };
        
    }).catch((err)=>{
        console.log(err, "Error in finding the user"); 
        return res.redirect('back');
    });
};


// module.exports.createSession = function(req, res){
//     //Check if user exists
//     User.findOne({email: req.body.Email}).then((user)=>{
//         // If user is not found
//         if(user == undefined){
//             console.log("Wrong username entered");
//             return res.redirect('back');
//         }else{
//                 //If password doesnt not match
//                 if(user.password != req.body.Password){
//                     console.log("Wrong password entered");
//                     return res.redirect('back');
//                 }else{
//                     res.cookie('user_id', user.id);
//                     console.log(user.id, " signed in");
//                     return res.redirect('/user/profile');
//                 }
//             }
//     }).catch((err)=>{
//         console.log(err, " Error occured in confirming the username");
//     })
// }

//Create session using passport
module.exports.createSession = function(req, res){
    // console.log(user.name, " signed in");
    return res.redirect('/');
}

//For signing out using manual authentication
module.exports.clearSession = function(req, res){
    res.clearCookie('user_id');
    return res.redirect('http://localhost:8000/user/sign-in');
}

//For signing out using passport.js

module.exports.signOut = function(req, res){
    req.logout();

    return res.redirect("/user/sign-in");
}

//Create posts
module.exports.createPost = function(req, res){
    //Check if the user is signed in
    if(req.isAuthenticated()){
        //Create the post
        Post.create({
            content: req.body.content,
            user: req.user._id
        }).then((post)=>{
            console.log("New Post by: ", post.id);
            return res.redirect('back');
        }).catch((err)=>{
            console.log(err, " Error in creating the post");
            return;
        })
    }else{
        console.log("Sign in to post");
        return res.redirect('/user/sign-in');
    }

    
}
