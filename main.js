/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global define, brackets */
define(function (require, exports, module) {
    "use strict";

    var AppInit         	= brackets.getModule("utils/AppInit"),
        androidController	= require("./src/androidController");


	AppInit.appReady(function () {
		androidController.init();
    });

});
