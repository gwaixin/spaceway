$(document).ready(function() {

	$('#add-online').click(function() {
		$.post('/user/chat/onlines', {}, function(views) {
			$('#chat-online-list').html(views);
		});
	});

});