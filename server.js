var express = require('express');
var session = require('express-session');
var app = express();
var serverConf = require('./config/server');
var model = require('./server/models/');
var crypto = require('crypto');

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
	// next();
	if (req.session.authUser) {
		res.locals.firstname = req.session.authUser.first_name;
		next();
	} else {
		res.redirect('/auth/login');
	}
};

app.use('/auth/', authRoute);
app.use('/user/', checkAuth, userRoute);
// app.use('/user/', userRoute);

// Prepare for io
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var Room = require('./server/socket/room');

var people = {};
// var rooms = {};
// var clients = [];
// var roomID;

io.on('connection', function(client) {
	// io.emit('online add', {row: 'new user'});
	client.on('disconnect', function() { // On Disconnect
		console.log('user has disconnected');
		// updateChatStatus(people[client.id].userid, false);
		delete people[client.userid];
		io.emit('chat leave', people);
	});

	client.on('chat join', function(user) {
		// updateChatStatus(user.id, true);
		people[user.id] = {firstname: user.firstname, userid: user.id, clientid: client.id};
		client.userid = user.id;
		io.emit('chat join', people);
	});

	client.on('chat send', function(chat) {
		console.log('testing chat send', client.room);
		io.to(client.room).emit('chat sent', {body: chat.body, from:chat.from});
	});

	client.on('chat private', function(data) {
		console.log('chat private');
		var roomid = "";
		if (typeof people[client.userid].room === 'undefined') {
			var chatTo = people[data.to.id];
			if (
				typeof chatTo.room != 'undefined' &&
				chatTo.room.with == client.userid
			) {
				console.log('ni copy og chatTo room');
				// copy roomid of the other person
				people[client.userid].room = chatTo.room;
				roomid = chatTo.room.id;
			} else { // create new room
				roomid = crypto.randomBytes(32).toString('hex');
				people[client.userid].room = {id: roomid};
				// console.log('create room', roomid);
			}
		}
		people[client.userid].room.with = data.to.id; // change talk with someone
		client.room = roomid;
		client.join(roomid);
		client.emit('chat private', {roomid: roomid});
	});

});

function updateChatStatus(userId, status) {
	model.User.findById(userId).then(function(user) {
		if (user) {
			user.updateAttributes({
				is_chat : status
			}).then(function(data) {
				console.log('User is_chat updated to : ' + status);
			});
		} else {
			console.log('User not found, invalid user id');
		}
	});
}

http.listen(3030, function() {
	console.log('Example app listening on port 3030!');
});