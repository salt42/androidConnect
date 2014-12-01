/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
    "use strict";

	var server = require('./server'),
		broadcaster = require('./udpBroadcaster'),
		serverPort = 4545;

    function init(domainManager) {
        if (!domainManager.hasDomain("androidconnect")) {
            domainManager.registerDomain("androidconnect", {major: 0, minor: 1});
        }


//        domainManager.registerCommand(
//            "simple",       // domain name
//            "getMemory",    // command name
//            cmdGetMemory,   // command handler function
//            false,          // this command is synchronous in Node
//            "Returns the total or free memory on the user's system in bytes",
//            [{name: "total", // parameters
//                type: "string",
//                description: "True to return total memory, false to return free memory"}],
//            [{name: "memory", // return values
//                type: "number",
//                description: "amount of memory in bytes"}]
//        );
		domainManager.registerCommand(
            "androidconnect",
            "addView",
            addView,
            false,
            "adds a view",
            [{name: "view",
                type: "string",
                description: "view to add"}],
			[]
        );
		domainManager.registerCommand(
            "androidconnect",
            "removeView",
            removeView,
            false,
            "removes a view",
            [{name: "id",
                type: "number",
                description: "view ID"}],
			[]
        );
		domainManager.registerCommand(
            "androidconnect",
            "setFocus",
            setFocus,
            false,
            "focus a view",
            [{name: "id",
                type: "number",
                description: "view ID"}],
			[]
        );

		domainManager.registerCommand(
            "androidconnect",
            "bracketsOpen",
            bracketsOpen,
            false,
            "on brackets open",
            [],
			[]
        );
		domainManager.registerCommand(
            "androidconnect",
            "bracketsClose",
            bracketsClose,
            false,
            "on brackets close",
            [],
			[]
        );
		//register events
		domainManager.registerEvent(
			"androidconnect",
			"viewComand",
			[
				{name: "data", type: "string"},
			]
		);

		server.init(serverPort);
		server.setViewComandHandler(function(data) {
			console.log(data)
			domainManager.emitEvent("androidconnect", "viewComand", data);
		});


		var broadcastMsg = 'bracketsAndroidConnect:' + serverPort + ':' + process.pid;
		broadcaster.init(5555, '192.168.0.255', broadcastMsg);
    }

	function addView(view) {
		server.addView(view);
	}
	function removeView(id) {

	}
	function setFocus(id) {

	}
	function bracketsOpen() {
		//server.onOpen();
	}
	function bracketsClose() {
		server.onClose();
	}





    exports.init = init;
}());
