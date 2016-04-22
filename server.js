var express = require('express');
var session = require('express-session');
var app = express();
var serverConf = require('./config/server');

// Set Session
app.use(session(serverConf.session));

// Set view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

// Set statics files or asset
app.use(express.static('node_modules'));
app.use(express.static('public'));

app.get('/', function (req, res) {
	var response = 'Hello Spacewayer';
	res.render('base', {title: 'Welcome to SpaceWay!!', page: 'landing/index'});
});

// Routes
var authRoute = require('./routes/authRoute');
var userRoute = require('./routes/userRoute');

// Check Authentication
var checkAuth = function(req, res, next) {
	if (req.session.authUser) {
		next();
	} else {
		res.redirect('/auth/login');
	}
};

app.use('/auth/', authRoute);
app.use('/user/', checkAuth, userRoute);

// Prepare for io
var http = require('http').Server(app);

http.listen(3030, function() {
	console.log('Example app listening on port 3030!');
});