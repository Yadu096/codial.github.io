const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req, res){
    //Get the posts from the DB
    Post.find({}).populate('user').then((posts)=>{
        return res.render('home', {
            title: "Home",
            posts: posts
        });
    }).catch((err)=>{
        console.log(err, " Error in fetching the posts");
    });

    
}