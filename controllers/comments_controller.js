const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');


//Create comments
module.exports.createComment =async function(req, res){
    try{
        let post = await Post.findById(req.body.post);

        let comment = await Comment.create({
            content: req.body.content,
            user: req.user.id,
            post: post._id
        });

        post.comments.push(comment._id);
        post.save();

        if(req.xhr){
            //Populate user name
            comment = await comment.populate('user');

            return res.status(200).json({
                
                comment: comment,
                message: "Comment Created!"
            });
        }

        req.flash('success', 'Comment added');
        return res.redirect('back');


    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}

//Delete comment
module.exports.deleteComment = async function(req, res){

    try{
        //Check if the comment to be deleted exists or not 
        let comment = await Comment.findById(req.params.id);

        //Check authorization
        if(comment.user == req.user.id){
            const postId = comment.post;

            //Delete the associated likes
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            //Delete the comment
            await Comment.findByIdAndDelete(comment.id);

            //Remove the commet from the associated post
            await Post.findByIdAndUpdate(postId, {$pull: {comments: comment.id}});

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Comment deleted successfully');
            return res.redirect('back');
        }else{
            req.flash('error', 'You are not authorized to delete this comment!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}