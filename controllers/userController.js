const createErr = require('http-errors');
const userModel = require('../models/userModel');
const billModel = require('../models/billModel');

exports.index = async(req, res, next) => {
    res.render('user', { active_profile: true });
};

exports.updateOne = async(req, res, next) => {
    try {
        await userModel.updateOne(req.user._id, req.file, req.body);
    } catch (err) {
        next(createErr(404));
    }
    res.redirect("/user");
}
exports.updatePassword = async(req, res, next) => {
    req.flash('updateMessage', await userModel.updatePassword(req.user, req.body.matkhaucu, req.body.matkhaumoi))
    res.render('user', { message: req.flash('updateMessage') });
}
exports.getUserBill = async(req, res, next) => {
    try {
        let userBills = await billModel.getUserBill(req.user._id);
        req.session.userBills = userBills;
        next();
    } catch (error) {
        next(createErr(404));
    }
}
exports.packageReceived = async(req, res, next) => {
    try {
        await billModel.packageReceived(req.params.id);
        res.redirect('/user');
    } catch (error) {
        next(createErr(404));
    }
}