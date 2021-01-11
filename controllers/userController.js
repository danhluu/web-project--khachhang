const { HttpError } = require('http-errors');
const userModel = require('../models/userModel');

exports.index = async(req, res, next) => {
    res.render('user', { active_profile: true });
};

exports.updateOne = async(req, res, next) => {
    try {
        await userModel.updateOne(req.params.id, req.file, req.body);
    } catch (err) {
        next(HttpError(404));
    }
    res.redirect("/user");
}