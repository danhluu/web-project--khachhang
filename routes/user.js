var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

const parser = require("../utils/multer");


router.get('/', userController.getUserBill, userController.index);
router.post('/update', parser.single('avatar'), userController.updateOne);
router.post('/', userController.updatePassword, userController.getUserBill)
router.post('/received/:id', userController.packageReceived)
    //
module.exports = router;