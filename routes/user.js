const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controller');
// const exp = require('constants');


//Set up the body parser
// router.use(express.urlencoded({extended: false}))

router.get('/sign-up', usersController.signup);
router.get('/sign-in', usersController.signin);
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

router.post('/create-user', usersController.createUser);
// router.post('/create-session', usersController.createSession);


//Use passport as middleware to authenticate signing in
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/user/sign-in'},
), usersController.createSession);

//Update user details
router.post('/update-user', passport.checkAuthentication, usersController.updateUser);

router.get('/clear-session', usersController.clearSession);

router.get('/sign-out', usersController.signOut);

module.exports = router;
