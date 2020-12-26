var express = require('express');
var router = express.Router();
var userController=require('../controllers/userController');
const parser = require("../utils/multer");


router.get('/:id',isLoggedIn,userController.index);
router.post('/update/:id',parser.single('avatar'),userController.updateOne);
//
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
  }