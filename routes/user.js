var express = require('express');
var router = express.Router();
var userController=require('../controllers/userController');
const parser = require("../utils/multer");


router.get('/:id',userController.index);
router.post('/update/:id',parser.single('avatar'),userController.updateOne);
//
module.exports = router;