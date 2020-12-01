const {db} = require('../db/db');
const { ObjectId} = require('mongodb');

exports.list = async () => {
    console.log('model db');
    const productsCollection = db().collection('bookDetail-min');
    const products = await productsCollection.find({}).toArray();
    console.dir(products);
    return products;
}
exports.get = async (id) => {
    const productsCollection = db().collection('bookDetail-min');
    const products = await productsCollection.findOne({_id: ObjectId(id)})
    return products;
}