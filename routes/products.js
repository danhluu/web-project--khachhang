const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController=require('../controllers/cartController');

router.get('/:id/add', cartController.add);
/* GET list of books. */
router.get('/', productController.getPage);
/* GET book detail */
router.get('/:id', productController.details);


module.exports = router;