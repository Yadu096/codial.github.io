const express = require('express');
const router = express.Router();
const passport = require('../config/passport_local_strategy');
const commentsController = require('../controllers/comments_controller');

//Create comment
router.post('/create', passport.checkAuthentication, commentsController.createComment);
//Delete comment
router.get('/delete/:id', passport.checkAuthentication, commentsController.deleteComment);

module.exports = router;