var express = require('express');
var authRoute = express.Router();
var bodyParser = require('body-parser');
var models = require('../server/models/');
var Sequelize = require('sequelize');

authRoute.use(bodyParser.urlencoded({ extended: true }));

authRoute.get('/login', function(req, res) {
	res.render('base', { page: '/auth/login', title: 'Login'});
});

authRoute.post('/login', function(req, res) {
	models.User.findOne({where:{username: req.body.username}}).then(function(user) {
		if (user && user.comparePassword(user, req.body.password)) {
			res.send('saktopassword');
		} else {
			res.render('base', { page: '/auth/login', title: 'Login', errors: [{message: 'Username and password does not match. please try again.'}]});
		}
	});
});

authRoute.get('/logout', function(req, res) {
	res.render('base', { page: '/auth/logout', title: 'Logout'});
});

authRoute.get('/register', function(req, res) {
	res.render('base', {reqBody: {}, page: '/auth/register', title: 'Register'});
});

authRoute.post('/register', function(req, res) {
	models.User.create({
		username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    first_name: req.body.firstname,
    status: true
	}).then(function(user) {
		res.redirect('/auth/register_complete');
	}).catch(function(error) {
		console.log(error);
		res.render('base', {reqBody: req.body, page: '/auth/register', title: 'Register', errors: error.errors});
	});
});

authRoute.get('/register_complete', function(req, res) {
	res.render('base', { page: '/auth/register_complete', title: 'Register Complete'});
});


module.exports = authRoute;