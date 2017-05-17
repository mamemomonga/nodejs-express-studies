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

// authentication
var authentication=require('./app/authentication');
authentication.setup_passport(app);

// Routers
authentication.setup_routes(app);
app.use('/', authentication.ensureLoggedIn(), require('./routes/index'));
app.use('/users', require('./routes/users'));

// error-handlers
(require('./app/error_handlers')(app));

module.exports = app;

