const productModel = require('../models/productModel');
const queryString = require('query-string');
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

exports.getPage= async(req,res,next)=>{
    //filter
    const filter={};
    filter.search=req.query.search || "";
    filter.category=req.query.category || "";
    //paginate
    const nPage=parseInt(req.query.page) || 1;
    const categories=await productModel.categories();
    const products=await productModel.getPage(filter,nPage);
    const info=await productModel.pageInfo(filter,nPage);
    const nextQuery={...req.query,page:info.nextPage};
    const previousQuery={...req.query,page:info.previousPage};
    const currentQuery={...req.query};
    const firstQuery={...req.query,page:1};
    res.render('products_table', {
        title:'Book Store',
        active_admin:true,
        categories:categories,
        products:products,
        totalPage:info.totalPage,
        totalPageQuery:queryString.stringify(totalQuery),
        hasNextPage:info.hasNextPage,
        hasPreviousPage:info.hasPreviousPage,
        nextPage:info.nextPage,
        previousPage:info.previousPage,
        nextPageQuery:queryString.stringify(nextQuery),
        previousPageQuery:queryString.stringify(previousQuery),
        currentPage:nPage,
        currentPageQuery:queryString.stringify(currentQuery),
        firstPageQuery:queryString.stringify(firstQuery)
    });
}
