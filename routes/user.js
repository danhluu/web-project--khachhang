var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

const parser = require("../utils/multer");


router.get('/', userController.index);
router.post('/update/:id', parser.single('avatar'), userController.updateOne);
router.post('/updatepassword', userController.updatePassword)
    //
module.exports = router;