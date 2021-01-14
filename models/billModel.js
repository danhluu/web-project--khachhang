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

exports.createBill = async(cart, user, shipping_info) => {
    const billsCollection = db().collection('bill');
    let updateDoc = {
        user_id: user._id,
        receiver: shipping_info.name,
        email: shipping_info.email,
        address: shipping_info.address,
        country: shipping_info.country,
        state: shipping_info.state,
        zipcode: shipping_info.zip,
        items: [{}],
        totalPrice: cart.totalPrice,
        status: 'Pending',
    }
    for (let i = 0, len = cart.products.length; i < len; i++) {
        let price = parseFloat(cart.products[i].price);
        price = String(price.toFixed(2));
        qty = Number(cart.products[i].quantity);
        item = {
            _id: cart.products[i].item._id,
            price: price,
            quantity: qty,
            currency: "USD",
        };
        if (i == 0) {
            updateDoc.items[0] = item;
        } else {

            updateDoc.items.push(item);
        }
    }
    try { await billsCollection.insertOne(updateDoc); } catch (error) {
        next(createErr(404));
    }
}
exports.getUserBill = async(user_id) => {
    const billsCollection = db().collection('bill');
    try {
        userBill = await billsCollection.findOne({ user_id: ObjectID(user_id) })
        return userBill;
    } catch (error) {
        next(createErr(404));
    }
}