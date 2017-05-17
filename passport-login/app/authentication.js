// authentication.js
'use strict';

var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    ensure_login  = require('connect-ensure-login'),
	crypto        = require("crypto"),
    db            = require('../db');

module.exports={

	// passportの初期化
	setup_passport:function(app){

		// 認証処理
		passport.use(new LocalStrategy(
			function(username, password, done) {
				// パスワードのHash化
				var sha256=crypto.createHash('sha256');
				sha256.update(password);
				// ユーザを探す
				db.users.findOne({
					'username': username,
					'password': sha256.digest('base64')
				},function(err,docs) {
					if(err) return done(err);
					if(!docs) return done(null,false);
					return done(null,docs._id);
				});
			}
		));

		// シリアライザ
		passport.serializeUser(function(userid, done) { done(null, userid) });

		// デシリアライザ
		passport.deserializeUser(function(id, done) {
			db.users.findOne({ '_id': id },function(err,docs) {
				if(err) return done(err);
				return done(null, {
					username: docs.username,
					is_admin: docs.is_admin ? true : false
				});
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
				failureFlash: true,
				failureFlash: 'ユーザ名またはパスワードが違います'
			})
		);
	
		app.get('/logout', function(req, res){
			req.logout();
			res.redirect('/');
		});

	},

	// middleware: ログイン状態のチェック
	ensureLoggedIn: ensure_login.ensureLoggedIn

};

