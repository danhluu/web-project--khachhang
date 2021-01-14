const productModel = require('../models/productModel');
const Cart = require('../models/cartModel');
const createErr = require('http-errors');
const billModel = require('../models/billModel');
exports.add = async(req, res, next) => {
    try {
        const productId = req.params.id;
        const quantity = Math.abs(parseInt(req.query.quantity)) || 0;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        const product = await productModel.get(productId);
        cart.add(product, productId, quantity);
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
    res.render('checkout', {
        title: 'Book Store',
    });
}

exports.saveBill = async(req, res, next) => {
    var cart = new Cart(req.session.cart);
    products = cart.generateArray();
    totalPrice = cart.totalPrice;
    try {
        await billModel.createBill({ products, totalPrice }, req.user, req.body);
        req.cart = null;
        var cart = new Cart({});
        req.session.cart = cart;
        // redirect to history
        res.redirect('/user');
    } catch (error) {
        next(createErr(404));
    }
}