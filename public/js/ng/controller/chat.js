spacewayApp.controller('chat', ['$scope', '$rootScope',
	function($s, $rs) {

		// variable for private properties
		var c = this;

		$s.init = function() {
			c.initilized();
			$s.user.id = $('#user-id').val();
			$s.user.name = $('#user-firstname').val();
			$s.socket = io();
			c.initChat();
		};

		/* Upon choosing a person to chat */
		$s.choosePerson = function(person) {
			$s.toPerson = person;
			$s.bodyMessage = [];
			$('.chat-title').text($s.toPerson.firstname);
			$('.chat-body').html('');
			$s.socket.emit('chat private', {to: person, from: $s.user.id});
		};

		/* On send chat to a person */
		$s.sendChat = function() {
			if ($.isEmptyObject($s.toPerson) || $s.body === '') {
				console.log('body is either empty or no person to chat');
				return;
			}
			$s.socket.emit('chat send', {
				from: $s.user,
				body: $s.body,
				to: $s.toPerson
			});
			$s.body = "";
		};

		
		/* PRIVATE FUNCTIONS */
		
		// clear variables
		c.initilized = function() {
			$s.onlines = [];
			$s.socket = null;
			$s.user = {};
			$s.toPerson = {};
			$s.body = "";
			$s.bodyMessage = [];
		};

		// initiate chat
		c.initChat = function() {
			// Sends your information to the socket server
			$s.socket.emit('chat join', {
				id: $s.user.id,
				firstname: $s.user.name
			});

			// Receive from socket that someone has join chat
			$s.socket.on('chat join', function(people) {
				$s.$apply(function() {
					c.updateOnlines(people);
				});
			});

			// Receive from socket that someone has quit chat
			$s.socket.on('chat leave', function(people) {
				$s.$apply(function() {
					c.updateOnlines(people);
				});
			});

			$s.socket.on('chat sent', function(chat) {
				$s.$apply(function() {
					var message = {
						body: chat.body,
						from: $s.user.id === chat.from.id ? 'ME' : chat.from.name
					};
					$s.bodyMessage.push(message);
				});
			});

			$s.socket.on('chat private', function(chat) {
				c.chatroomid = chat.roomid;
			});
		};

		// update online list
		c.updateOnlines = function(people) {
			$s.onlines = [];
			for (var key in people) {
				if (
					people[key].userid !== $s.user.id &&          // Exclude client user id
					!isObjectExist(people[key], $s.onlines)       // Disable duplicate
				) {
					$s.onlines.push(people[key]);
				}
			}
		};

		c.chatroomid = '';
		
		$s.init();
		
	}
]);