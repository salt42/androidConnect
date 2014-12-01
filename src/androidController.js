/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
/*global define */
define(function (require, exports) {
    "use strict";

    var DomainController = require('./domainController'),
		api = {},
		Views = [];




	var ViewFactory = (function() {
		var exports = {},
			ViewIDCount	= 0;

		exports.createView = function(title) {
			//privates
			var ID = ++ViewIDCount,
				Listeners = {};
			/**
			 * View for in android
			 * @class
			 */
			function View(title) {
				this.ID = ID;
				this.Title = title || 'undefined';
				this.HTML = '';
				this.JS = '';
			}

			View.prototype.trigger = function(type, data) {
				if (!(type in Listeners)) { return; }
				for (var i in Listeners[type]) {
					Listeners[type][i].call(null, data);
				}
			},
			View.prototype.bind = function(type, cb) {
				if (!(type in Listeners)) {
					Listeners[type] = [];
				}
				Listeners[type].push(cb);
			},
			/*
			 *	@param {string} name
			 */
			View.prototype.setTitle = function(title) {
				this.Title = title;
				return this;
			};
			/*
			 *	@param {string} html string
			 */
			View.prototype.setHTML = function(html) {
				this.HTML = html;
				return this;
			};
			/*
			 *	@param {string} js string
			 */
			View.prototype.setJS = function(js) {
				this.JS = js;
				return this;
			};
			View.prototype.getID = function() { return this.ID; };
			View.prototype.getTitle = function() { return this.Title; };
			View.prototype.getHTML = function() { return this.HTML; };
			View.prototype.getJS = function() { return this.JS; };

			return new View(title);
		};

	  return exports;
	})();



	api.createView = function(title) {
		var newView = ViewFactory.createView(title);
		return newView;
	};
	/*
	 *	@param {View||string} view
	 */
	api.removeView = function(view) {

	};
	/*
	 *	@param {View} view
	 */
	api.addView = function(view) {
		Views.push(view);
		DomainController.addView(view);
	};
	api.getViewByID = function(ID) {
		for(var i in Views) {
			if (Views[i].ID === ID) {
				return Views[i];
			}
		}
	};
	/*
	 *	@param {View} view
	 */
	api.focusView = function(view) {

	};


	exports.init = function() {
		DomainController.setComandHandler(function(data) {
			var view = api.getViewByID(data.viewID);
			if (view) {
				view.trigger(data.type, data.data);
			}
		});
		//test
		DomainController.init();
		var testView = api.createView('testView');
		testView.setTitle('Overview')
				.setHTML('<h1 class="headline">HUND KATZE MAUS<h1>')
				.setJS("$('.headline').click(function() { BracketsConnect.sendComand('nice', {data:42}); });");
		testView.bind('nice', function(data) {
			console.log('nice!!!!!!!!!!!! ', data)
		});
		api.addView(testView);



		var testView2 = api.createView('testView2');
		testView2.setTitle('Overview2')
				.setHTML('<h1>nix<h1>')
				.setJS('console.log(View);');
		api.addView(testView2);


	};
});
