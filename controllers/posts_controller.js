const Post = require('../models/post');
const Comment = require('../models/comment');
const connectMongo = require('connect-mongo');

//Create posts
module.exports.createPost = function(req, res){
    //Check if the user is signed in to create the post
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

module.exports.deletePost = function(req, res){
    //Check if the post to be deleted exists
    Post.findById(req.params.id).then((post)=>{
    //Check if the user that is requesting to delete is the same as the one who created it
    if(post.user == req.user.id){
        Post.findByIdAndDelete(req.params.id).catch((err)=>{
            console.log(err, "Could not delete the post");
            return;
        })
        //Remove the corresponding comments as well
        Comment.deleteMany({post: req.params.id}).catch((err)=>{
            console.log(err, "Coould not delete the comments");
            return;
        });
        return res.redirect('back');
    }
    }).catch((err)=>{
        console.log(err, "Could not find the post to be deleted");
        return;
    });


}