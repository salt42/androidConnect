/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global require, __dirname, exports */
(function () {
    "use strict";
	var fs = require('fs'),
		express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server),
		viewCache = [],
		clients = [],
		emitEvent;



	function startListening(port) {
		server.listen(port, function() {
			console.log('Listening on port %d', server.address().port);

		});
	}

	function broadcast(channel, data) {
		for (var i in clients) {
			clients[i].socket.emit(channel, data);
		}
	}

	exports.init = function(port) {

		app.use(express.static(__dirname + '/androidUI'));
		app.get('/', function (req, res) {
			res.sendfile(__dirname + '/androidUI/index.html');
		});

		io.sockets.on('connection', function (socket) {
			// der Client ist verbunden
			clients.push(socket);
			socket.emit('system', {
				type: 'resetViews',
				data: viewCache,
			});


			socket.on('system', function (data) {
				//io.sockets.emit('system', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
			});
			socket.on('comand', function (data) {
				//send to brackets and dispatch than
				//io.sockets.emit('system', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
			});
		});

		startListening(port);

	};
	exports.addView = function(view) {
		viewCache.push(view);
		broadcast('system', {
			type : 'addView',
			data : view,
		})
	};
	exports.setEventHandler = function(cb) {
		emitEvent = function() {
			//dispatch event
			cb.apply(null, arguments);
		};
	};
})();

















