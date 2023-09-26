const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codial_DB');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Could not connect to the Mongo"));
db.once('open', function(){
    console.log("Successfully loaded Mongo");
})

module.exports = db;