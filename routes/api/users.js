const express = require('express');
const router = express.Router();

const usersController = require('../../controllers/api/userAPIs');
router.get('/is-user-exist',usersController.isUserExist);
module.exports = router;