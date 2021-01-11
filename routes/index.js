var express = require('express');
var passport = require('passport');
var router = express.Router();
var homeController = require('../controllers/homeController');

router.get('/', homeController.index);
router.get('/login', homeController.login);
router.get('/signup', homeController.signup);

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