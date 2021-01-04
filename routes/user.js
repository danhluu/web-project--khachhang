var express = require('express');
var passport = require('passport');
var router = express.Router();
var userController = require('../controllers/userController');
var ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

const parser = require("../utils/multer");


router.get('/', ensureLoggedIn('/login'), userController.index);
router.post('/update/:id', parser.single('avatar'), userController.updateOne);
//
module.exports = router;