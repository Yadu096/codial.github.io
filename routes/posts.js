const express = require('express');
const router = express.Router();
const passport = require('../config/passport_local_strategy');
const postsController = require('../controllers/posts_controller');

//Create post
router.post('/create', passport.checkAuthentication, postsController.createPost);
//Delete a post
router.get('/delete/:id', passport.checkAuthentication, postsController.deletePost);

module.exports = router;