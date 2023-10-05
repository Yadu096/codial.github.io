const express = require('express');
const router = express.Router();
const postsAPI = require('../../../controllers/api/v1/posts_api');
const passport = require('passport');

router.get('/list', postsAPI.index);
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), postsAPI.delete);

module.exports = router;