$(document).ready(function() {
	var socket = io();

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
			// console.log(typeof ol[people[id].userid+], ol);
			// console.log(ol);
			if (!inArray(people[id].userid, ol)) {
				ol.push(people[id].userid);
				var newOnline = "<a href='#' class='list-group-item' data-clientid='"+people[id].clientid+"' data-userid='"+people[id].userid+"'>"+people[id].firstname+"</a>";
				$('#chat-online-list').append(newOnline);
			}
		}
	}

});