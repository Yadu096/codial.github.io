const express = require('express');
const router = express.Router();
const postsAPI = require('../../../controllers/api/v1/posts_api');

router.get('/list', postsAPI.index);
router.delete('/delete/:id', postsAPI.delete);

module.exports = router;