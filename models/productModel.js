const { db } = require('../db/db');
const { ObjectId } = require('mongodb');

exports.categories = async() => {
    const categoriesCollection = db().collection('Categories');
    const categories = await categoriesCollection.find({}).toArray();
    return categories;
}
exports.get = async(id) => {
    const productsCollection = db().collection('bookDetail');
    const products = await productsCollection.findOne({ _id: ObjectId(id) })
    return products;
}


////PAGINATION
const ITEMS_PER_PAGE = 30;
exports.getPage = async(_filter, _nPage, _limit = ITEMS_PER_PAGE) => {
    const filter = {};
    filter.name = { '$regex': _filter.search, '$options': 'i' };
    filter.categories = { '$regex': _filter.category, '$options': 'i' }

    const productsCollection = db().collection('bookDetail');
    const products = await productsCollection.find(filter).limit(_limit).skip(_limit * (_nPage - 1)).toArray();
    return products;
}

exports.pageInfo = async(_filter, _nPage) => {
    const filter = {};
    filter.name = { '$regex': _filter.search, '$options': 'i' };
    filter.categories = { '$regex': _filter.category, '$options': 'i' }

    const totalBook = await db().collection('bookDetail').countDocuments(filter);
    const totalPage = await Math.ceil(totalBook / ITEMS_PER_PAGE);
    const hasNextPage = await _nPage < totalPage;
    const hasPrePage = await _nPage > 1;
    const nextPage = await (hasNextPage === true ? (_nPage + 1) : _nPage);
    const prePage = await (hasPrePage === true ? _nPage - 1 : _nPage);
    const info = {
        totalBook: totalBook,
        totalPage: totalPage,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPrePage,
        nextPage: nextPage,
        previousPage: prePage,
        ITEMS_PER_PAGE: ITEMS_PER_PAGE
    };
    return info;
}