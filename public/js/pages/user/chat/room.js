var socket;

$(document).ready(function() {
	
	socket = io();

	$('#add-online').click(function() {
		$.post('/user/chat/onlines', {}, function(views) {
			$('#chat-online-list').html(views);
		});
	});

	socket.emit('chat join', {
		id: $('#user-id').val(),
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
			if (!inArray(people[id].userid, ol)) {
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
		if (userinfo && body != '') {
			socket.emit('chat send', {
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
		$('.chat-conversation').append(chat.body);
	});

});
var userinfo = {};
var chatroomid = '';
$(document).on('click', '.online-chat', function() {
	userinfo = {
		id: $(this).data('userid'),
		firstname: $(this).data('firstname'),
		clientid: $(this).data('clientid')
	};

	socket.emit('chat private', {to: userinfo, from: $('#user-id').val()});
	
	$('.chat-title').text(userinfo.firstname);
	$('.chat-body').html('');
});