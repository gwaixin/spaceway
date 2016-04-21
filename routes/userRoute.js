var express = require('express');
var userRoute = express.Router();
var bodyParser = require('body-parser');

userRoute.use(bodyParser.urlencoded({extended: true}));

userRoute.get('/account', function(req, res) {
	res.render('base', processLocal('/user/account', 'account'));
});

userRoute.get('/', function(req, res) {
	res.render('base', processLocal('/user/index', 'index'));
});

userRoute.get('/profile', function(req, res) {
	res.render('base', processLocal('/user/profile', 'profile'));
});

userRoute.get('/settings', function(req, res) {
	res.render('base', processLocal('/user/settings',  'settings'));
});

function processLocal(page, title) {
	return {
		page: page,
		title: title,
		header: 'userHeader'
	};
}

module.exports = userRoute;
