/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global define, document, $, brackets, setTimeout, localStorage, setInterval, window, CSSRule */
define(function (require, exports, module) {
    "use strict";

    var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
		NodeDomain     = brackets.getModule("utils/NodeDomain");


    var domain = new NodeDomain("androidconnect", ExtensionUtils.getModulePath(module, "node/domain"));


	function exec() {
		console.log('exec com: ', arguments[0]);
        domain.exec.apply(domain, arguments)
            .done(function () {
//                console.log(
//                    "[brackets-simple-node] Memory: %d bytes free",
//                    memory
//                );
            }).fail(function (err, a, b) {
                console.error("[androidConnect-node]", err, a, b);
            });
	}

	exports.setFocus = function(ID) {};
	exports.addView = function(view) {
		exec('addView', view);
	};
	exports.removeView = function(ID) {};

});
