const {db} = require('../db/db');
const {ObjectId} = require('mongodb');

exports.list = async () => {
    console.log('model db');
    const productsCollection = db().collection('bookDetail');
    const products = await productsCollection.find({}).toArray();
    console.dir(products);
    return products;
}
exports.categories=async()=>{
    const categoriesCollection = db().collection('Categories');
    const categories = await categoriesCollection.find({}).toArray();
    return categories;
}
exports.get = async (id) => {
    const productsCollection = db().collection('bookDetail');
    const products = await productsCollection.findOne({_id: ObjectId(id)})
    return products;
}
exports.deleteOne=async(id)=>{
    const productsCollection=db().collection('bookDetail');
    const product=await productsCollection.deleteOne({_id:ObjectId(id)})
    return product;
}
exports.updateOne=async(bookInfo)=>{
    const productsCollection = db().collection('bookDetail');
    const filter = { _id:ObjectId(bookInfo.id)};
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        name:bookInfo.name,
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
    const productsCollection = db().collection('bookDetail');
    const result = await productsCollection.insertOne(bookInfo);
    return result;
}
////PAGINATION
const ITEMS_PER_PAGE=30;
exports.getPage=async(_filter,_nPage,_limit=ITEMS_PER_PAGE)=>{
    const filter={};
    filter.name={ '$regex' : _filter.search, '$options' : 'i' };
    filter.categories={ '$regex' : _filter.category, '$options' : 'i' }

    const productsCollection = db().collection('bookDetail');
    const products=await productsCollection.find(filter).limit(_limit).skip(_limit*(_nPage-1)).toArray();
    return products;
}

exports.pageInfo=async(_filter,_nPage)=>{
    const filter={};
    filter.name={ '$regex' : _filter.search, '$options' : 'i' };
    filter.categories={ '$regex' : _filter.category, '$options' : 'i' }

    const totalBook=await db().collection('bookDetail').countDocuments(filter);
    const totalPage=await Math.ceil(totalBook/ITEMS_PER_PAGE);
    const hasNextPage=await _nPage<totalPage;
    const hasPrePage=await _nPage>1;
    const nextPage=await (hasNextPage===true?(_nPage+1):_nPage);
    const prePage=await (hasPrePage===true?_nPage-1:_nPage);
    const info={totalBook:totalBook,totalPage:totalPage,hasNextPage:hasNextPage
        ,hasPreviousPage:hasPrePage,nextPage:nextPage,prePage:prePage,ITEMS_PER_PAGE:ITEMS_PER_PAGE};
    return info;
}