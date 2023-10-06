const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const nodeMailer = require('../mailers/users_mailer');


module.exports.signup = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }

    return res.render('user_sign_up', {
        title: "Sign Up"
    });
}

module.exports.signin = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/');
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

//Creating user in the database
module.exports.createUser =async function(req, res){

    try{
        //Check if password and confirm password are same
        if(req.body.Password != req.body.Confirm_Password){
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        };
        //Check if user already exists
        let user = await User.findOne({email: req.body.Email});

        //If returned value of user is undefined that means user does not exist and hence create the user
        if(user==undefined){
            //Create the user
            let user = await User.create({
                email: req.body.Email,
                password: req.body.Password,
                name: req.body.Name,
                age: req.body.Age,
                gender: req.body.Gender
            });
            //Send mail to the new user created
            nodeMailer.newUser(user);
            req.flash('success', 'You have signed up successfully');
            return res.redirect('http://localhost:8000/user/sign-in');
        }else{
            req.flash('error', 'User already exists');
            return res.redirect('http://localhost:8000/user/sign-in');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
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
    req.flash('success', ' Logged in successfully');
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
    req.flash('success', 'You have logged out succesfully');

    return res.redirect("/user/sign-in");
}

module.exports.updateUser = async function(req, res){

    try{
        let user = await User.findById(req.user.id);
        //Normal parser won't be able to parse the multipart form data so we'll need the multer function here
        User.uploadedAvatar(req, res, function(err){
            if(err){
                console.log("******Error", err);
            }

            user.name = req.body.name;
            user.email = req.body.email;
            user.age = req.body.age;
            user.gender = req.body.gender;

            
            
            if(req.file){

                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                }

                user.avatar = User.avatarPath +'/' + req.file.filename;
            }
            user.save();

            req.flash('success', 'Profile updated successfully');
            return res.redirect('back');
        })

    }catch(err){
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }
}




