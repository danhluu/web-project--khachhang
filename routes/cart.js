const express = require('express');
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCart);
/* GET book detail */
router.get('/remove', cartController.removeItem);
router.get('/edit', cartController.editQuantity);

router.get('/checkout', ensureLoggedIn('/login'), cartController.checkOut);


router.post('/done', ensureLoggedIn('/login'), cartController.insertBill)


module.exports = router;