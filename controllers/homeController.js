const productModel = require('../models/productModel');
const authModel = require('../models/authModel')
const createErr = require('http-errors');
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
    await authModel.resetMail(req, req.body.email);
    res.render('forgot', { message: req.flash('message') });
}
exports.reset = async(req, res) => {
    let user;
    try {
        user = await authModel.findToken(req.params.token, { $gt: Date.now() });
        res.render('reset', { user: req.user });
    } catch (error) {
        req.flash('message', 'Password reset token is invalid or has expired.');
        res.redirect('/forgot');
    }
}
exports.resetPassword = async(req, res, next) => {
    try {
        await authModel.resetPassword(req.params.token, { $gt: Date.now() }, req.body.newPassword);
        req.flash('loginMessage', 'Reset mat khau thanh cong!');
        res.redirect('/login');
    } catch (err) {
        next(createErr(404))
    }
}
exports.confirmEmail = async(req, res, next) => {
    let user;
    try {
        user = await authModel.findConfirmToken(req.params.token, { $gt: Date.now() });
        await authModel.confirmedEmail(user._id);
        res.redirect('/login');
    } catch (error) {
        next(createErr(404));
    }
}