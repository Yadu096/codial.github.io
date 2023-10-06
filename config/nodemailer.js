const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');



const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.google.com',
    port: 587,
    secure: false,
    auth:{
        user: 'ysingh10f',
        pass: 'PutYourPassowrdHere'
    }
});

const renderTemplate = (data, relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log(err, " Error occured in rendering the file");
                return;
            }

            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}