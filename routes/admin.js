var express = require('express');
var router = express.Router();
var adminController=require('../controllers/adminController');


router.get('/', adminController.getPage);
router.get('/delete/:id',adminController.deleteOne);
router.post('/update',adminController.updateOne);
router.post('/add',adminController.addOne);
module.exports = router;