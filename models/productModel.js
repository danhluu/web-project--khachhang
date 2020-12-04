const {db} = require('../db/db');
const {ObjectId} = require('mongodb');

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
exports.deleteOne=async(id)=>{
    const productsCollection=db().collection('bookDetail-min');
    const product=await productsCollection.deleteOne({_id:ObjectId(id)})
    return product;
}
exports.updateOne=async(bookInfo)=>{
    const productsCollection = db().collection('bookDetail-min');
    const filter = { _id:ObjectId(bookInfo.id)};
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        author:bookInfo.author,
        price:parseInt(bookInfo.price),
        categories:bookInfo.categories,
        image:bookInfo.image,
      },
    };
    const result = await productsCollection.updateOne(filter,updateDoc,options);
    return result;
}
exports.addOne=async(bookInfo)=>{
    const productsCollection = db().collection('bookDetail-min');
    const result = await productsCollection.insertOne(bookInfo);
    return result;
}