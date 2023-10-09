const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){

    try{
    //Get the posts from the DB
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        },
        populate: {
            path: 'likes'
        }
    }).populate('comments')
    .populate('likes');

    //Find all users and send them in the response data to show a list of friends
    let users = await User.find({});
    let friends = await User.findById(req.user._id).populate({
        path: 'friendships',
        populate: {
            path: 'from_user'
        }   
    }).populate({
        path: 'friendships',
        populate: {
            path: 'to_user'
        }
    });

    return res.render('home', {
        title: "Home",
        posts: posts,
        users: users,
        friends: friends
    });

    }catch(err){
        console.log(err, " Error ");
        return;
    }

    
}