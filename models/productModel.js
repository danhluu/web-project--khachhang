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
    const name = { '$regex': _filter.search, '$options': 'i' };
    const author = { '$regex': _filter.search, '$options': 'i' };
    const categories = { '$regex': _filter.category, '$options': 'i' };
    const filter = {
        $and: [{
                $or: [
                    { 'name': name },
                    { 'author': author }
                ]
            },
            { 'categories': categories },
            { 'price': { $gte: _filter.minprice, $lte: _filter.maxprice } }
        ]
    };
    const productsCollection = db().collection('bookDetail');
    const products = await productsCollection.find(filter).sort({ name: _filter.orderby }).limit(_limit).skip(_limit * (_nPage - 1)).toArray();
    return products;
}

exports.pageInfo = async(_filter, _nPage) => {
    const name = { '$regex': _filter.search, '$options': 'i' };
    const author = { '$regex': _filter.search, '$options': 'i' };
    const categories = { '$regex': _filter.category, '$options': 'i' };
    const filter = {
        $and: [{
                $or: [
                    { 'name': name },
                    { 'author': author }
                ]
            },
            { 'categories': categories }
        ]
    };

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

exports.getSimilar = async(_category, _quantity) => {
    const productsCollection = db().collection('bookDetail');
    const products = await productsCollection.aggregate([
        { $match: { categories: { '$regex': _category, '$options': 'i' } } },
        { $sample: { size: _quantity } }
    ]).toArray();
    return products;
}

exports.updateViews = async(id, _views) => {
    _views++;
    const productsCollection = db().collection('bookDetail');
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            views: _views
        },
    };
    const result = await productsCollection.updateOne(filter, updateDoc, options);
    return result;
}
exports.getMax = async() => {
    const productsCollection = db().collection('bookDetail');
    const products = await productsCollection.find().sort({ views: -1 }).limit(6).toArray();
    console.log(products);
    return products;
}