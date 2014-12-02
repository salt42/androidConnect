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
		emitComand;



	function startListening(port) {
		server.listen(port, function() {
			console.log('Listening on port %d', server.address().port);
		});
	}

	function broadcast(channel, data) {
		if (!data) { data = null; }
		io.emit(channel, data);
	}

	exports.init = function(port) {

		app.use(express.static(__dirname + '/androidUI'));
		app.get('/', function (req, res) {
			res.sendfile(__dirname + '/androidUI/index.html');
		});
		app.get('/viewid/:id', function (req, res) {
			var view = viewCache[ parseInt(req.params.id) ];

			res.sendfile(view.path + '/index.html');
		});
		io.sockets.on('connection', function (socket) {
			socket.on('system', function (data) {
				if (data.type === 'getViews') {
					socket.emit('system', {
						type: 'setViews',
						data: viewCache,
					});
				}
				//io.sockets.emit('system', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
			});
			socket.on('comand', function (data) {
				emitComand(data);

				//send to brackets and dispatch than
				//io.sockets.emit('system', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
			});
		});

		startListening(port);

	};
	exports.addView = function(view) {
		viewCache[view.ID] = view;
		broadcast('system', {
			type : 'addView',
			data : view,
		});
	};
	exports.setViewComandHandler = function(cb) {
		emitComand = cb;
	};
	exports.onClose = function() {
		viewCache = [];
		broadcast('system', {
			type : 'close'
		});
	};
})();

















