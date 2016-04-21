var express = require('express');
var authRoute = express.Router();
var bodyParser = require('body-parser');

authRoute.use(bodyParser.urlencoded({ extended: true }));

authRoute.get('/login', function(req, res) {
	res.render('base', { page: '/auth/login', title: 'Login'});
});

authRoute.get('/logout', function(req, res) {
	res.render('base', { page: '/auth/logout', title: 'Logout'});
});

authRoute.get('/register', function(req, res) {
	res.render('base', { page: '/auth/register', title: 'Register'});
});

authRoute.get('/register_complete', function(req, res) {
	res.render('base', { page: '/auth/register_complete', title: 'Register Complete'});
});


module.exports = authRoute;