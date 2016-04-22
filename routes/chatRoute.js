var express = require('express');
var chatRoute = express.Router();
var bodyParser = require('body-parser');

chatRoute.use(bodyParser.urlencoded({extended: true}));

chatRoute.get('/', function(req, res) {
	var locals = processLocal('/user/chat', 'Chatting');
	locals.confluid = true;
	locals.js = [{src: '/js/pages/user/chat/room.js'}];
	res.render('base', locals)
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

