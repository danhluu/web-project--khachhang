const express = require('express');
const passport = require('passport');
const router = express.Router();
const homeController = require('../controllers/homeController');
const ensureLoggedOut = require("connect-ensure-login").ensureLoggedOut;

router.get('/', homeController.index);
router.get('/login', ensureLoggedOut(), homeController.login);
router.get('/signup', homeController.signup);
router.get('/forgot', homeController.forgot);
router.get('/reset/:token', homeController.reset);

router.post('/reset/:token', homeController.resetPassword);
router.post('/forgot', homeController.sendForgot);
router.post('/login', passport.authenticate('local-login', {
    successReturnToOrRedirect: '/user',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/signup', passport.authenticate('local-signup', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true,
}));

router.get('/logout', function(req, res) {

    req.logout();
    // Nếu không destroy session thì sau khi log out đơn hàng vẫn lưu lại.
    if (req.session) {
        req.session.destroy();
    }
    // Clear cookie
    res.clearCookie(this.cookie, { path: '/' });
    res.redirect('/');
});

module.exports = router;