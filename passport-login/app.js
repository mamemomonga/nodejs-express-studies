// app.js
'use strict';

var express = require('express'),
    path    = require('path');
var app     = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon
//app.use(require('serve-favicon')(path.join(__dirname, 'public', 'favicon.ico')));

// logger
app.use(require('morgan')('combined'));

// bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookie-parser
app.use(require('cookie-parser')());

// static
app.use(express.static(path.join(__dirname, 'public')));

// express-session
app.use(require('express-session')({
	secret: 'nyancat',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 30 * 60 * 1000 }
}));

// connect-flash
app.use(require('connect-flash')());

// ユーザ認証処理
var authentication=require('./app/authentication');
authentication.setup_passport(app);

// Routers
authentication.setup_routes(app);
app.use('/', authentication.ensure_login(), require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

