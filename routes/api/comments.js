const express = require('express');
const router = express.Router();

const commentsController = require('../../controllers/api/commentsController');
router.post('/write-comment',commentsController.writeComment);
router.post('/load-comment',commentsController.loadComment);
module.exports = router;