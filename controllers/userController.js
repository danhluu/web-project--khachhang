const userModel = require('../models/userModel');

exports.index = async (req, res, next) => {
    res.render('user', await userModel.get(req.params.id));
};

exports.updateOne=async(req,res,next)=>{
    const user=await userModel.updateOne(req.params.id,req.file,req.body);
    console.log('user updated:',user);
}