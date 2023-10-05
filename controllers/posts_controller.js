const Post = require('../models/post');
const Comment = require('../models/comment');

//Create posts
module.exports.createPost = async function(req, res){

    try{
        //Check if the user is signed in to create the post
        if(req.isAuthenticated()){
            //Create the post
            let post = await Post.create({
                content: req.body.content,
                user: req.user._id
            });


            //Check if the coming request is ajax
            if(req.xhr){

                return res.status(200).json({
                    data:{
                        post: post,
                        user: req.user
                    },
                    message: "Post Created!"
                });
            }

            req.flash('success', 'Post Published');
            return res.redirect('back');
            
        }else{
            req.flash('error', 'Sign in to post');
            return res.redirect('/user/sign-in');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}

module.exports.deletePost = async function(req, res){

    try{
        //get the post
        let post = await Post.findById(req.params.id);


        //Check if the user that is requesting to delete is the same as the one who created it
        if(post.user == req.user.id){
            await Post.findByIdAndDelete(req.params.id);
            //Remove the associated comments as well
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message: "Post Deleted!"
                })
            }

            req.flash('success', 'Post deleted successfully');
            return res.redirect('back');
        }else{
            req.flash('error', 'You are not authorized to delete this post');
            return res.redirect('back');
        }


    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }

}