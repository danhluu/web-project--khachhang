

/* GET home page. */
exports.index=(req,res,next)=>{
    res.render('index',{title:'Book Store',active_home:true});
}