const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

//Action for api asking for posts list
module.exports.index = async function(req, res){

    try{
        //Get the posts from the DB ans populate the 
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
    
        return res.json(200, {
            message: "List of Posts",
            posts: posts
        });
    
        }catch(err){
            console.log(err, " Error ");
            return res.json(500, {
                message: "Internal server failure",
            })
        }
}

//Action for deleting post on APi request
module.exports.delete = async function(req, res){
    try{
        //Get the post 
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            //Find and Delete the post 
            await Post.findByIdAndDelete(req.params.id);
            //Remove the associated comments as well
            await Comment.deleteMany({post: req.params.id});

            return res.json(200, {
                post: post,
                sandesh: "Post and associated comments are deleted succesfully"
            });
        }else{
            return res.json(401, {
                sandesh: "You are not authorized to delete this post"
            });
        }

    }catch(err){
        console.log('error', err);
        return res.json(500, {
            sandesh: "Internal server failure"
        })
    }
}
