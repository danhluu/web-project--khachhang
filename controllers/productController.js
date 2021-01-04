const productModel = require('../models/productModel');
const queryString = require('query-string');

exports.details = async(req, res, next) => {
    console.log(req.user);
    product = await productModel.get(req.params.id);
    res.render('product_detail', { product, user: req.user, active_products: true });
}

exports.getPage = async(req, res, next) => {
    //filter
    const filter = {};
    filter.search = req.query.search || "";
    filter.category = req.query.category || "";
    //paginate
    const nPage = parseInt(req.query.page) || 1;
    const categories = await productModel.categories();
    const products = await productModel.getPage(filter, nPage);
    const info = await productModel.pageInfo(filter, nPage);
    const nextQuery = {...req.query, page: info.nextPage };
    const previousQuery = {...req.query, page: info.previousPage };
    const totalQuery = {...req.query, page: info.totalPage };
    const currentQuery = {...req.query };
    const firstQuery = {...req.query, page: 1 };
    console.log(info);
    res.render('products', {
        title: 'Book Store',
        active_products: true,
        categories: categories,
        products: products,
        totalPage: info.totalPage,
        totalPageQuery: queryString.stringify(totalQuery),
        hasNextPage: info.hasNextPage,
        hasPreviousPage: info.hasPreviousPage,
        nextPage: info.nextPage,
        previousPage: info.previousPage,
        nextPageQuery: queryString.stringify(nextQuery),
        previousPageQuery: queryString.stringify(previousQuery),
        currentPage: nPage,
        currentPageQuery: queryString.stringify(currentQuery),
        firstPageQuery: queryString.stringify(firstQuery),
        user: req.user
    });
}