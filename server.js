var express = require('express');
var app = express();
require('./config/server');

// Routes
var authRoute = require('./routes/authRoute');
var userRoute = require('./routes/userRoute');

app.use('/auth/', authRoute);
app.use('/user/', userRoute);


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

// Prepare for io
var http = require('http').Server(app);

http.listen(3030, function() {
	console.log('Example app listening on port 3030!');
});