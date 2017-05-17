// 認証処理
'use strict';

var passport     = require('passport'),
    Strategy     = require('passport-local').Strategy,
    ensure_login = require('connect-ensure-login'),
    db           = require('../db');

module.exports={
	// passportの初期化
	setup_passport:function(app){
		passport.use(new Strategy(
			function(username, password, cb) {
				db.users.findByUsername(username, function(err, user) {
					if (err) { return cb(err); }
					if (!user) { return cb(null, false, { message: 'ユーザエラー' }); }
					if (user.password != password) { return cb(null, false, { message: 'パスワードエラー' }); }
					return cb(null, user);
				});
			}
		));

		passport.serializeUser(function(user, cb) {
		  cb(null, user.id);
		});

		passport.deserializeUser(function(id, cb) {
		  db.users.findById(id, function (err, user) {
		    if (err) { return cb(err); }
		    cb(null, user);
		  });
		});

		app.use(passport.initialize());
		app.use(passport.session());


	},
	// passport用routesの初期化
	setup_routes:function(app) {
		app.get('/login', function(req, res, next) {
			var flash=req.flash('error');
			flash = ( flash.length >= 1 ) ? flash[0] : "";
			console.log(flash);
			res.render('login',{message:flash});
		});
		
		app.post('/login',
			passport.authenticate('local', {
				successRedirect: '/',
				failureRedirect: '/login',
				failureFlash: true
			})
		);
	
		app.get('/logout', function(req, res){
			req.logout();
			res.redirect('/');
		});

	},
	ensure_login: function() {
		return ensure_login.ensureLoggedIn();
	},

};

