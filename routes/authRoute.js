var express = require('express');
var authRoute = express.Router();
var bodyParser = require('body-parser');
var models = require('../server/models/');

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

authRoute.post('/register', function(req, res) {
	models.User.create({
		username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    first_name: req.body.firstname,
    status: true
	}).then(function(user) {
		if (user) {
			res.redirect('/auth/register_complete');
		} else {
			res.send('');
			// has error
		}
	});
});

authRoute.get('/register_complete', function(req, res) {
	res.render('base', { page: '/auth/register_complete', title: 'Register Complete'});
});


module.exports = authRoute;