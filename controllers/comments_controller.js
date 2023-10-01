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

//Delete comment
module.exports.deleteComment = function(req, res){
    //Check if the comment to be deleted exists or not 
    Comment.findById(req.params.id).then((comment)=>{
        //Check authorization
        
        if(comment.user == req.user.id){
            const postId = comment.post;
            Comment.findByIdAndDelete(comment.id).catch((err)=>{
                console.log(err, "Could not delete the comment");
                return;
            })
            Post.findByIdAndUpdate(postId, {$pull: {comments: comment.id}}).catch((err)=>{
                console.log(err, " Could not find the corresponding post");
                return;
            });
            return res.redirect('back');
        }
    }).catch((err)=>{
        console.log(err, " Could not find the comment to be deleted");
        return;
    });
}