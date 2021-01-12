const { db } = require('../db/db');
const { ObjectID } = require('mongodb');
const createErr = require('http-errors');

exports.productBill = async(req, res, next) => {
    const productBill = db().collection('productBill');
    const objectID = new ObjectID();
    for (let index = 0; index < req.body.cart.length(); index++) {

    }
    return objectID;
}

exports.createBill = async(products, user, shipping_info) => {
    const billsCollection = db().collection('bill');
    const objectID = new ObjectID();
    let updateDoc = {
        user_id: user._id,
        receiver: shipping_info.name,
        email: shipping_info.email,
        address: shipping_info.address,
        country: shipping_info.country,
        state: shipping_info.state,
        zipcode: shipping_info.zip,
        cart_id: objectID,
        item_list: {
            items: []
        },
        status: 'Pending',
    }
    for (let i = 0, len = products.length; i < len; i++) {
        let price = parseFloat(products[i].price);
        price = String(price.toFixed(2));
        qty = Number(products[i].quantity);
        item = {
            _id: products[i].item._id,
            price: price,
            quantity: qty,
            currency: "USD",
        };

        updateDoc.item_list.items.push(item);
    }
    try { await billsCollection.insertOne(updateDoc); } catch (error) {
        next(createErr(404));
    }
}