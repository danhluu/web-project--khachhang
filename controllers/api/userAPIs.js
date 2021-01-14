const authModelAPI = require('../../models/authModel');
exports.isUserExist=async(req,res,next)=>{
    res.json(await authModelAPI.isUserExist(req.query.email));
}