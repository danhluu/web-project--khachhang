const productModel = require('../models/productModel');
const userModel =require('../models/userModel');

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

exports.forgot = (req,res,next) =>{
    res.render('forgot');
    
}
exports.sendForgot = async(req,res,next) =>{
    console.log('toi dya roi');
    await userModel.sendMail(req,req.body.email);
    res.redirect('/forgot');
}
exports.reset= async(req,res)=>{
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
        user: req.user
      });
    });
}
