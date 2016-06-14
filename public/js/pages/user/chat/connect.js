// init connect
var connect = {
	peerid: null,
	userid: $('#user-id').val(),
	userfname: $('#user-firstname').val(),
	toid: null,
	video: {
		mine: null,
		other: null
	}
};

var resetConnection = function() {
	connect.toid = null;
	connect.video = { mine: null, other: null};
};

var peer = new Peer(connect.userid, {host: 'localhost', port: 3050, path: '/peerjs', debug: 2, secure:true});

var peerConn = null;


/* Peer handler */
peer.on('call', function(call) {
	var vh = videoHandler();

	// current other media connection
	connect.video.other = call;
	
	// Answe the call, providing our mediaStream
	call.answer(window.localStream);
	// accept call from caller
	vh.acceptOtherVid(call);
	// start my vid once answering calls
	vh.startMyvid().then(function(resolve) {
		var call = peer.call(connect.toid, resolve);
		vh.acceptOtherVid(call);
	}, function(error) { console.log(error); });
});

peer.on('open', function(id) {
	// alert('testing');
	connect.peerid = id;
	console.log('[PEER] on open');
});

peer.on('close', function() {
	console.log('[PEER] on close');
	peer.disconnect();
});

/**
 * starts peer connection to both parties
 * @param  int connectTo      other person's id
 * @return Class conn         Peer connection class
 */
var startPeerConnection = function(connectTo) {
	var vh   = videoHandler();
	var conn = peer.connect(connectTo);
	connect.toid = connectTo;
	console.log('[PEER] starts peer connection with: ', connectTo);

	// 'When somebody is connected'
	peer.on('connection', function(con) {

		console.log('someone has connected', connectTo);

		// client start its video and then start call the other video
		vh.startMyvid().then(function(resolve) {

			vh.startCallVid(resolve).then(function() {
				console.log('[PEER] done calling to # ' + connect.toid);
			}, function(reject) {
				console.log(reject);
			});

		}, function(reject) {
			console.log(reject);
		});

	});

	// Receive messages
	conn.on('data', function(data) {
		console.log('receive somehting');
	});

	conn.on('close', function(con) {
		console.log('[PEER-CON] peer connection on close');
		connect.video.other.close();
		vh.resetVids();
	});

	return conn;

};

/**
 * video chat functions for handling peer to peer stream
 * @return Object functions for startMyvid and acceptOtherVid
 */
var videoHandler = function() {

	var vh = this;

	/**
	 * start client vid
	 */
	vh.startMyvid = function() {
		return new Promise(function(resolve, reject) {
			if (connect.video.mine === null) {
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
				navigator.getUserMedia({audio: true, video: true}, function(stream) {
					console.log('[PEER] setting up my video');
					$('#mycamera-connect').fadeOut('fast');
					// Set your video displays
					$('#my-video').prop('src', URL.createObjectURL(stream));
					
					window.localStream = stream;
					connect.video.mine = stream;
					
					$('#othercamera-connect').fadeIn('fast');
					
					resolve(stream);
				}, function(){ reject('[PEER] Error on getting User media'); });
			} else {
				reject('[PEER] user has video connection already');
			}
		});
	};

	/**
	 * accept their stream and update #their-video for display
	 * @param  Object call from peer object call
	 */
	vh.acceptOtherVid = function(call) {
		
		// Wait for stream on the call, then set peer video display
		call.on('stream', function(stream){
			console.log('[PEER-MS] call on stream');
			$('#othercamera-connect').fadeOut('fast');
			$('#their-video').prop('src', URL.createObjectURL(stream));
		});

		call.on('close', function() {
			console.log('[PEER-MS] close');
		});
		
		call.on('error', function(error) {
			console.log('[PEER-MS] error', error);
		});
	};

	vh.startCallVid = function(stream) {
		// proceed to their vid handler
		return new Promise(function(resolve, reject) {
			if (connect.toid === null) {
				reject('[PEER] no id to connect');
			} else {
				console.log('[PEER] Start calling id #' + connect.toid);
				var call = peer.call(connect.toid, stream);
				vh.acceptOtherVid(call);
				resolve(call);
			}
		});
	};


	vh.resetVids = function(call) {
		resetConnection();
		$('#othercamera-connect').fadeIn('fast');
		$('#mycamera-connect').fadeIn('fast');
		$('#their-video').prop('src', '');
		$('#my-video').prop('src', '');
	};

	return vh;
};