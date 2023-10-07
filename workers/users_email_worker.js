const queue = require('../config/kue');

const newUserMailer = require('../mailers/users_mailer');

queue.process('emails', function(job, done){
    console.log('New users email worker is processing a job', job.data);

    newUserMailer.newUser(job.data);
    done();
});