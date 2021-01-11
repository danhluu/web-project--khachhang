const productModel = require('../models/productModel');
const Cart = require('../models/cartModel');
const queryString = require('query-string');
const createErr = require('http-errors');
const billModel = require('../models/billModel');
exports.add = async(req, res, next) => {
    try {
        const productId = req.params.id;
        const quantity = Math.abs(parseInt(req.query.quantity)) || 0;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        const product = await productModel.get(productId);
        cart.add(product, productId, quantity);
        console.log(cart);
        req.session.cart = cart;
        const refreshUrl = '/products/' + productId;
        res.redirect(refreshUrl);
    } catch (error) {
        next(createErr(404));
    }
};
exports.getCart = async(req, res, next) => {
    if (!req.session.cart) {
        return res.render('cart', {
            products: null,

        });
    }
    const cart = new Cart(req.session.cart);
    res.render('cart', {
        title: 'Book Store',
        products: cart.getItems(),
        totalPrice: cart.totalPrice,
    });
}
exports.removeItem = async(req, res, next) => {
    const productId = req.query.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
}
exports.editQuantity = async(req, res, next) => {
    const bookiD = req.query.bookiD;
    const newQ = parseInt(req.query.newQ) || 0;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.editQuantity(bookiD, newQ);
    req.session.cart = cart;
    res.redirect('/cart');
}
exports.checkOut = async(req, res, next) => {
    const cart = new Cart(req.session.cart);
    res.render('checkout', {
        title: 'Book Store',
        products: cart.getItems(),
        totalPrice: cart.totalPrice,
    });
}

exports.insertBill = async(req, res, next) => {
    const id = await billModel.productBill(req, res, next);
    await billModel.createBill(req, id);
}