const productModel = require('../models/productModel');

exports.index = async (req, res, next) => {
    // Get books from model
    const products = await productModel.list();
    console.log('products', products);
    // Pass data to view to display list of books
    res.render('products', {title:'Book Store',active_products:true,products});
};

exports.details = async (req, res, next) => {
    res.render('product_detail', await productModel.get(req.params.id));
}