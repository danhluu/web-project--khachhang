/* GET home page. */
exports.index=(req,res,next)=>{
    res.render('index',{title:'Book Store',active_home:true});
}

exports.login=(req,res,next)=>{
    res.render('login');
};

exports.signup =(req,res,next)=>{
    res.render('signup');
}