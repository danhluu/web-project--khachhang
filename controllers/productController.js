const productModel = require('../models/productModel');
const commentModel = require('../models/commentModel');
const queryString = require('query-string');
const createErr = require('http-errors');

exports.details = async(req, res, next) => {
    try {
        const product_detail = await productModel.get(req.params.id);
        if (product_detail.views === null || product_detail.views === undefined) {
            product_detail.views = 0;
        }
        await productModel.updateViews(req.params.id, product_detail.views);
        console.log(product_detail);
        const comments = await commentModel.loadComment(req.params.id, 1);
        const similar_products = await productModel.getSimilar(product_detail.categories, 3);
        res.render('product_detail', { product_detail: product_detail, similar_products: similar_products, comments: comments, user: req.user, active_products: true });
    } catch (error) {
        next(createErr(404))
    }
}

exports.getPage = async(req, res, next) => {
    //filter
    const filter = {};
    filter.search = req.query.search || "";
    filter.category = req.query.category || "";
    filter.orderby = parseInt(req.query.orderby) || 1;
    filter.minprice = parseInt(req.query.minprice) || 0;
    filter.maxprice = parseInt(req.query.maxprice) || 200;
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