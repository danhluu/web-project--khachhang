const express = require('express');
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCart);
router.get('/remove', cartController.removeItem);
router.get('/edit', cartController.editQuantity);

router.get('/checkout', ensureLoggedIn('/login'), cartController.checkOut);
router.post('/checkout', ensureLoggedIn('/login'), cartController.increaseProductsSold, cartController.saveBill)


module.exports = router;