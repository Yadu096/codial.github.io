const { default: mongoose } = require('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');


//Create comments
module.exports.createComment = function(req, res){

    
    const postId = req.body.post;
    Post.findById(postId).then((post)=>{
        Comment.create({
            content: req.body.content,
            user: req.user.id,
            post: post._id
        }).then((comment)=>{
            post.comments.push(comment);
            post.save();
            return res.redirect('back');
        }).catch((err)=>{
            console.log(err, " Error in creating the comment");
            return;
        })
    }).catch((err)=>{
        console.log(err, "No post to comment on");
        return;
    });
    
    
}