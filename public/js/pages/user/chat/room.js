var socket;
var userid;
$(document).ready(function() {
	userid = $('#user-id').val();
	socket = io();

	$('#add-online').click(function() {
		$.post('/user/chat/onlines', {}, function(views) {
			$('#chat-online-list').html(views);
		});
	});


	socket.emit('chat join', {
		id: userid,
		firstname: $('#user-firstname').val()
	});

	socket.on('chat join', function(people) {
		updateOnlineList(people)
	});

	socket.on('chat leave', function(people) {
		updateOnlineList(people)
	});

	function updateOnlineList(people) {
		var ol = [];
		$('#chat-online-list').html('');
		for (var id in people) {
			console.log(userid);
			if (!inArray(people[id].userid, ol) && people[id].userid !== userid) {
				ol.push(people[id].userid);
				var newOnline = "<a href='#' class='list-group-item online-chat' "+
												"data-clientid='"+people[id].clientid+"' "+
												"data-userid='"+people[id].userid+"' "+
												"data-firstname='"+people[id].firstname+"'>"+people[id].firstname+"</a>";
				$('#chat-online-list').append(newOnline);
			}
		}
	}

	$('.chat-send').click(function() {
		var body = $('.chat-body').val();
		if (userinfo && body !== '') {
			socket.emit('chat send', {
				from: userid,
				body: body,
				to: userinfo
			});
			$('.chat-body').val('');
		}
	});

	socket.on('chat private', function(chat) {
		chatroomid = chat.roomid;
		// console.log(chatroomid);
	});

	socket.on('chat sent', function(chat) {
		console.log('testing chat sent');
		$('.chat-conversation').append(formatChat(chat.body, chat.from));
	});

	function formatChat(body, from) {
		var chatFrom = from == userid ? 'ME' : userinfo.firstname;
		var newChat = "<div class='row'><div class='col-lg-1'><h4>" +chatFrom+ "</h4></div><div class='col-lg-10'>" +
						"<blockquote>" +
						  "<p>"+ body +"</p>" +
						  "<small>"+ Date.now() +"</small>" +
						"</blockquote></div></div>";

		return newChat;
	}

});
var userinfo = {};
var chatroomid = '';
$(document).on('click', '.online-chat', function() {
	userinfo = {
		id: $(this).data('userid'),
		firstname: $(this).data('firstname'),
		clientid: $(this).data('clientid')
	};

	socket.emit('chat private', {to: userinfo, from: userid});
	
	$('.chat-title').text(userinfo.firstname);
	$('.chat-body').html('');
});