const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const passport = require('passport');

router.get('/', passport.checkAuthentication, homeController.home);

router.use('/user', require('./user'));
router.use('/comments', require('./comments'));
router.use('/posts', require('./posts'));

//Router for api
router.use('/api', require('./api'));


module.exports = router;
