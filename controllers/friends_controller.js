const Friendship = require('../models/friendships');
const User = require('../models/user');

module.exports.addFriends = async function(req, res){
    try{
        let to_user = await User.findById(req.query.to_id);
        let from_user = await User.findById(req.query.from_id);

        //add in the friendship collection
        let friends = await Friendship.create({
            to_user: to_user._id,
            from_user: from_user._id
        });

        //Add in individual friend's array
        to_user.friendships.push(friends._id);
        to_user.save();

        from_user.friendships.push(friends._id);
        from_user.save();

        req.flash('success', 'Friend added');
        return res.redirect('back');

    }catch(err){
        req.flash('error', 'Could not add as friend');
        console.log(err,"***Error***");
        return res.redirect('back');
    }
}