var express = require('express');
var userRoute = express.Router();
var bodyParser = require('body-parser');

userRoute.use(bodyParser.urlencoded({extended: true}));

userRoute.get('/account', function(req, res) {
	res.render('base', {page:'/user/account', title: 'account'});
});

userRoute.get('/', function(req, res) {
	res.render('base', {page:'/user/index', title: 'index'});
});

userRoute.get('/profile', function(req, res) {
	res.render('base', {page:'/user/profile', title: 'profile'});
});

userRoute.get('/settings', function(req, res) {
	res.render('base', {page:'/user/settings', title: 'settings'});
});

module.exports = userRoute;
