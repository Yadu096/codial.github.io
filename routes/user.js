const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const exp = require('constants');

//Set up the body parser
router.use(express.urlencoded({extended: false}))

router.get('/sign-up', usersController.signup);
router.get('/sign-in', usersController.signin);
router.get('/profile', usersController.profile);

router.post('/create', usersController.create);
router.post('/create-session', usersController.createSession);
router.get('/clear-session', usersController.clearSession);

module.exports = router;
