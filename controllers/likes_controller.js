const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.toggleLike = async function(req, res){

    try{

        console.log("Like controller called");
        // route for this is going to be /likes/toggle/?id=" "&&type=" "

        let likeable;
        //toggle variable
        let isDeleted = false;

        //Check if the likeable object is a Post or a Comment
        if(req.query.type == "Post"){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //Check if like already exists
        let like = await Like.findOne({
            user: req.user._id,
            likeable: likeable._id,
            onModel: req.query.type
        });

        if(like){
            //Like already exists on the object, delete it
            likeable.likes.pull(like._id);
            likeable.save();

            await Like.findByIdAndDelete(like._id);
            isDeleted = true;

        }else{
            //Create the like

            let newLike = await Like.create({
                user: req.user,
                likeable: likeable._id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();

        }

        return res.json(200,{
            message: "Request Complete",
            data: {
                deleted: isDeleted
            }
        });

    }catch(err){
        console.log(err, "***Error***");
        return res.json(501, {
            message: "Error occured while liking the likeable"
        });
    }

}