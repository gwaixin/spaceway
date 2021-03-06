var express = require('express');
var chatRoute = express.Router();
var bodyParser = require('body-parser');

chatRoute.use(bodyParser.urlencoded({extended: true}));

chatRoute.get('/', function(req, res) {
	var locals = processLocal('/user/chat', 'Chatting 2');
	locals.confluid = true;
	locals.js = [
		'/js/socket.io/socket.io.js',
		// '/skyway-peerjs-electron/dist/peer.js',
		'/promise-js/promise.js',
		'/peerjs/dist/peer.js',
		'/js/pages/user/chat/connect.js',
		'/js/ng/controller/chat.js',
	];
	locals.user = req.session.authUser;
	res.render('base', locals);
});

chatRoute.post('/onlines', function(req, res) {
	// res.render('partials/chat/online.ejs');
	res.send('No online user');
});

function processLocal(page, title) {
	return {
		page: page,
		title: title,
		header: 'userHeader'
	};
}

module.exports = chatRoute;

