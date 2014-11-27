/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global require, setInterval, exports, Buffer */
(function () {
    "use strict";

	var dgram	= require('dgram'),
		socket = dgram.createSocket('udp4'),
		Message = "[hello network]",
		Address = '192.168.0.255',
		Port = 5555;



	function start(){
		socket.bind(Port, function() {
			socket.setBroadcast(true);
		});
		setInterval(function () {
			socket.send(new Buffer(Message),
					0,
					Message.length,
					Port,
					Address,
					function (err) {
						if (err) console.log(err);
					}
			);
		}, 3000);
	}
	exports.init = function(port, addr, msg) {
		Port = port;
		Address = addr;
		Message = msg;
		start();
	};

})();
