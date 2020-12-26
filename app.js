require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var hbs=require('hbs');
const { MongoClient } = require("mongodb");

//init routers
var indexRouter = require('./routes/index');
var productsRouter=require('./routes/products');
var productdetailRouter=require('./routes/productdetail');
var cartRouter=require('./routes/cart');
//var adminRouter=require('./routes/admin');

//init API routers
var fetchPageRouter=require('./routes/api/products');

require('./db/db.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname,'/views/partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// res.locals is an object passed to hbs engine
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

//routes
app.use('/', indexRouter);
app.use('/products',productsRouter);
app.use('/cart',cartRouter);
//app.use('/admin',adminRouter);

//API routes
app.use('/api/products',fetchPageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
