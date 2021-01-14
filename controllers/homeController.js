const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
/* GET home page. */
exports.index = async(req, res, next) => {
    const products = await productModel.getMax();
    res.render('index', { title: 'Book Store', active_home: true, products: products });
}

exports.login = (req, res, next) => {
    res.render('login', { message: req.flash('loginMessage') });
};

exports.signup = (req, res, next) => {
    res.render('signup', { message: req.flash('signupMessage') });
}

exports.forgot = (req, res, next) => {
    res.render('forgot', { message: req.flash('message') });

}
exports.sendForgot = async(req, res, next) => {
    await userModel.sendMail(req, req.body.email);
    // res.json("Dang trong qua trinh sua chua");
    res.render('forgot', { message: req.flash('message') });
}
exports.reset = async(req, res) => {
    user = await userModel.findToken(req.params.token, { $gt: Date.now() })
    if (!user) {
        req.flash('message', 'Password reset token is invalid or has expired.');
        res.redirect('/forgot');
    }
    res.render('reset', { user: req.user });
}
exports.resetPassword = async(req, res) => {
    let user = await userModel.resetPassword(req.params.token, { $gt: Date.now() }, req.body.newPassword)
    if (!user) {
        req.flash('message', 'Password reset token is invalid or has expired.');
        return res.redirect('back');
    }
    req.logIn(user, function(err) {
        done(err, user);
    });
}