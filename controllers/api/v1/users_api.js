const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

//Create a token
module.exports.createSession = async function(req, res){

    try{
        //Find the user
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.json(422, {
                message: "Invalid Username/Password"
            });
        }

        return res.json(200, {
            message: "Sign in successful, here is your token:",
            data:{
                token: jwt.sign(user.toJSON(), 'Codial', {expiresIn: 100000})
            }
        });

    }catch(err){
        console.log(err, "******Error*******");
        return;
    }

}