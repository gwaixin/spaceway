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
		io.to(client.room).emit('chat disconnect');
	});

	client.on('chat join', function(user) {
		// updateChatStatus(user.id, true);
		people[user.id] = {
			firstname: user.firstname,
			userid: user.id,
			clientid: client.id,
			peerid: user.peerid
		};
		client.userid = user.id;
		io.emit('chat join', people);
	});

	client.on('chat send', function(chat) {
		// console.log('testing chat send', client.room);
		
		io.to(client.room).emit('chat sent', {
			body: chat.body,
			from: chat.from
		});
	});

	client.on('chat private', function(data) {
		console.log('chat private : ');
		var roomid = "";
		// reset client room
		if (typeof people[data.from].room != 'undefined') {
			client.leave(people[data.from].room.id);
		}
		if (
			typeof  people[data.to.userid].room != 'undefined' &&
			Number( people[data.to.userid].room.with) == Number(data.from)
		) {
			// copy roomid of the other person
			console.log(data.from + ' is joining room with user # ' + data.to.userid );
			roomid =  people[data.to.userid].room.id;
			people[data.from].room =  {
				id: roomid,
				with: data.to.userid
			};
			client.broadcast.to(people[data.to.userid].clientid).emit('peer connected', data.from);
		} else { 
			// create new room
			console.log(data.from + ' creates new room with',  people[data.to.userid].userid);
			roomid = createRoomId();
			people[data.from].room = {
				id: roomid,
				with: data.to.userid
			};
		}
		client.room = roomid;
		client.join(roomid);
		client.emit('chat private', {roomid: roomid, to: data.to.userid});
	});
});

function createRoomId() {
	return  crypto.randomBytes(32).toString('hex');
}

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


// for peer settings
var fs = require('fs');
var peerApp = express();
var peerServer = require('https').createServer({
  key: fs.readFileSync('ssl/gl_wildcard.nativecamp.net_2016.nopass.key'),
  cert: fs.readFileSync('ssl/gl_wildcard.nativecamp.net_2016.crt'),
  ca: fs.readFileSync('ssl/gl_wildcard.nativecamp.net_2016.chain')
}, peerApp);
var peer       = require("peer").ExpressPeerServer;

peerApp.use('/peerjs', peer(peerServer, {debug: true}));
peerServer.listen(3050, function() {
	console.log("Peer app listening on port 3050");
});

peerServer.on('connection', function(id) {
	console.log('peer connection id : ' + id);
});

peerServer.on('disconnect', function(id) {
	console.log('peer disconnected id: ' + id);
});

http.listen(3030, function() {
	console.log('Spaceway app listening on port 3030!');
});