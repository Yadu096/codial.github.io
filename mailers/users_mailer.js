const nodeMailer = require('../config/nodemailer');

module.exports.newUser = (user)=>{
    console.log("Mailer is called", user);
    let htmlString = nodeMailer.renderTemplate({user: user}, '/users/new_user.ejs');

    nodeMailer.transporter.sendMail({
        from: 'ysingh10f@gmail.com',
        to: user.email,
        subject: 'Welcome to the codial',
        html: htmlString
    },(err, info)=>{
        if(err){
            console.log(err, " Error occured in sending the mail");
            return;
        }
        console.log("Message sent successfully", info);
        return;
    });
}