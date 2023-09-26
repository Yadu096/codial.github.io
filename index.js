const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');

//Set the static folder
app.use(express.static('assets'));

//Use cookie parser
app.use(cookieParser());

//Setup layouts
app.use(expressLayouts);
//Exttract styles and scripts from sub pages into layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Set the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//Set the router
app.use('/', require('./routes/index'));

app.listen(port, function(err){
    if(err){console.error.bind(console, "Could not run the server")}

    console.log(`Server is running on the port ${port}`);
})