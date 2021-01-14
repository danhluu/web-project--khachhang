const { db } = require('../db/db');
const { ObjectID } = require('mongodb');
const createErr = require('http-errors');
const { ExpectationFailed } = require('http-errors');

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
            productName: cart.products[i].item.name,
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
    await billsCollection.insertOne(updateDoc);
}
exports.getUserBill = async(user_id) => {
    const billsCollection = db().collection('bill');

    let userBills = await billsCollection.find({ user_id: ObjectID(user_id) }).toArray();
    for (let i in userBills) {
        userBills[i].time = ObjectID(userBills[i]._id).getTimestamp();
    }
    console.log(userBills);
    return userBills;

}
exports.packageReceived = async(package_id) => {
    let updateDoc = {
        status: 'Received'
    }
    await db().collection('bill').updateOne({ _id: ObjectID(package_id) }, updateDoc);
}