const productModel = require('../models/productModel');
exports.index = async (req, res, next) => {
    // Get books from model
    const products = await productModel.list();
    console.log('products', products);
    // Pass data to view to display list of books
    res.render('products_table', {title:'Book Store',active_admin:true,products});
};

exports.deleteOne=async(req,res,next)=>{
    const product=await productModel.deleteOne(req.params.id);
    console.log('product deleted:',product);
    res.redirect('/admin');
}

exports.updateOne=async(req,res,next)=>{
    const product=await productModel.updateOne(req.body);
    console.log('product updated:',product);
    res.redirect('/admin');
}
exports.addOne=async(req,res,next)=>{
    const product=await productModel.addOne(req.body);
    console.log('product added:',product);
    res.redirect('/admin');
}