const productModel = require('../models/productModel');

/* GET home page. */
exports.index=async(req,res,next)=>{
    const products=await productModel.getMax();
    res.render('index',{title:'Book Store',active_home:true,products:products});
}

exports.login=(req,res,next)=>{
    res.render('login');
};

exports.signup =(req,res,next)=>{
    res.render('signup');
}