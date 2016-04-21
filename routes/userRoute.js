var express = require('express');
var userRoute = express.Router();
var bodyParser = require('body-parser');

userRoute.use(bodyParser.urlencoded({extended: true}));

userRoute.get('/account', function(req, res) {
	res.render('base', processLocal('/user/account', 'User Account'));
});

userRoute.get('/', function(req, res) {
	res.render('base', processLocal('/user/index', 'User Dashboard'));
});

userRoute.get('/profile', function(req, res) {
	res.render('base', processLocal('/user/profile', 'User Profile'));
});

userRoute.get('/settings', function(req, res) {
	res.render('base', processLocal('/user/settings',  'User Settings'));
});

userRoute.get('/contacts', function(req, res) {
	res.render('base', processLocal('/user/contacts', 'User Contacts'))
});

userRoute.get('/chat', function(req, res) {
	res.render('base', processLocal('/user/chat', 'Chatting'))
});

function processLocal(page, title) {
	return {
		page: page,
		title: title,
		header: 'userHeader'
	};
}

module.exports = userRoute;
