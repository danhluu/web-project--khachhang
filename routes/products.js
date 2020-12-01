const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/* GET list of books. */
router.get('/', productController.index);
router.get('/:id', productController.details);
/* GET book detail */
// router.get('/:id', productController.details);

module.exports = router;