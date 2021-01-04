const express = require('express');
const router = express.Router();
const cartController=require('../controllers/cartController');

router.get('/',cartController.getItems);
/* GET book detail */
// router.get('/:id', productController.details);
router.get('/remove',cartController.removeItem);
router.get('/edit',cartController.editQuantity);
module.exports = router;