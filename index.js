const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const passportLocal = require('./config/passport_local_strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');

//Set up node-sass-middleware
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
 


//Parse the form data
app.use(express.urlencoded({extended: false}));

//Use cookie parser
app.use(cookieParser());

//Set the static folder
app.use(express.static('./assets'));


//Setup layouts
app.use(expressLayouts);
//Exttract styles and scripts from sub pages into layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Set the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//Use passport session middleware
app.use(session({
    name: "codial",
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || "Mongo store set up successfully");
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
//Set the details of the authenticated user in the locals for views to access it
app.use(passport.setAuthenticatedUser);

//Set the router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){console.error.bind(console, "Could not run the server")}

    console.log(`Server is running on the port ${port}`);
})