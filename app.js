require('dotenv').config();

var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var hbs=require('hbs');
const { MongoClient } = require("mongodb");

var bodyParser = require('body-parser');

var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var productsRouter=require('./routes/products');
var userRouter=require('./routes/user');

const { RequestTimeout } = require('http-errors');
require('./db/db.js');

//init routers
var indexRouter = require('./routes/index');
var productsRouter=require('./routes/products');
var cartRouter=require('./routes/cart');
//var adminRouter=require('./routes/admin');

//init API routers
var fetchPageRouter=require('./routes/api/products');
var commentsRouter=require('./routes/api/comments');

require('./db/db.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname,'/views/partials'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.bodyParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// res.locals is an object passed to hbs engine
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use(session({secret: "laksjdoiwahfalsnc21983ulkasdn", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./utils/passport')(passport);


app.use('/', indexRouter);
app.use('/products',productsRouter);
app.use('/cart',cartRouter);
//app.use('/admin',adminRouter);


app.use('/user',userRouter);
//API routes
app.use('/api/products',fetchPageRouter);
app.use('/api/comments',commentsRouter);
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
