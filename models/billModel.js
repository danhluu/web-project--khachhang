const { db } = require('../db/db');
const { ObjectID } = require('mongodb');

exports.productBill = async(req, res, next) => {
    const productBill = db().collection('productBill');
    const objectID = new ObjectID();
    for (let index = 0; index < req.body.cart.length(); index++) {

    }
    return objectID;
}

exports.createBill = async(req, productBill) => {
    let updateDoc = {
        productBillID: productBill,
        name: req.body.name,

    }
}


}