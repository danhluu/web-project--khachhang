const userModel = require('../models/userModel');

exports.index = async(req, res, next) => {
    res.render('user', { user: req.user, active_profile: true });
};

exports.updateOne = async(req, res, next) => {
    const user = await userModel.updateOne(req.params.id, req.file, req.body);
}