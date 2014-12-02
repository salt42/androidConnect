var bracketsConnect = (function() {
	var $sidebar,
		$content;

	var NetworkController = {
		connected : false,
		listeners : {},

		init : function(ip, port) {
			var self = this;

			this.socket = io.connect();

			this.socket.on('system', function (data) {
				if ('type' in data) {
//					console.log('system incoming:', data, self);
					self.notify.call(self, data.type, data.data);
				}
			});

			this.socket.on('comand', function (data) {
				if ('type' in data) {
					//self.notify.call(self, data.type, data.data, data.viewID);
				}
			});
		},

		bindSystem : function(type, callback) {
			if (!(type in this.listeners)) {
				this.listeners[type] = [];
			}
			this.listeners[type].push(callback);
		},

		notify : function (type, data, viewID) {
			var i;
			if (!(type in this.listeners)) { return; }
			for(i in this.listeners[type]) {
				this.listeners[type][i].call(null, data, viewID);
			}
		},
		sendComand : function(viewID, type, data) {
			var pack = {
				viewID: viewID,
				type: type,
				data: data,
			};

			this.sendPackage('comand', pack);
		},
		sendSystem : function(type, data) {
			var pack = {
				type: type,
				data: data,
			};
			this.sendPackage('system', pack);
		},
		sendPackage : function(channel, pack) {
			this.socket.emit(channel, pack);
		},
	};
	function newBracketsConnectApi(View) {
		var listeners = {};

		return {
			sendComand : function(type, data) {
				console.log('sendComand');
				NetworkController.sendComand(View.ID, type, data);
			},
			bindComand : function(type, callBack) {
				if (!(type in listeners)) {
					listeners[type] = [];
				}
				listeners[type].push(callBack);
			}
		};
	}

	var View = function(id, title, html, js, path) {
		this.ID = id;
		this.Title = title || 'undefined';
		this.HTML = html;
		this.JS = js;
		this.path = path || '';
		if(path !== '') {
			this.$container = $('<iframe class="view"></iframe>')
				.attr('name', title)
				.attr('src', 'http://' + window.location.host + '/viewid/' + this.ID);
		} else {
			this.$container = $('<div class="view"></div>')
				.attr('name', title);
			this.$container.html(html);
		}
	}
	View.prototype.load = function() {
		SidebarManager.register(this);
		//create space and run code
		if (this.path !== '') {

		} else {
			(function(View) {
				//create bracketConnect api
				var BracketsConnect = newBracketsConnectApi(View);

				eval(View.JS);

			})(this);
		}
	};
	View.prototype.kill = function() {
		this.$container.remove();
	};
	var SidebarManager = {
		buttons : [],

		init : function() {
			$sidebar.on('click', function(e) {
				if ($(e.target).hasClass('button') && $(e.target).attr('name')) {
					this.trigger(parseInt($(e.target).attr('name')) );
				}
			}.bind(this));

		},
		register : function(view) {
			var $button = $('<div class="button" name="' + view.ID + '"></div>');
			this.buttons.push({
				id : view.ID,
				$ele : $button,
				view : view
			});
			$sidebar.append($button);
		},
		trigger : function(ID) {
			ViewManager.setFocus(ID);
		},
		clear : function() {
			$sidebar.empty();
			this.buttons = [];
		},
		remove : function(view) {
			var index;

			for(index in this.buttons) {
				if (this.buttons[index].id === view.id) {
					this.buttons[index].$ele.remove();
					break;
				}
			}
			this.buttons.splice(index, 1);
		}
	};
	/*	show/hide content | build secure enviremnent
	 *	@class
	 */
	var ViewManager = {
		Views : [],
		Focus : null,

		init : function() {
			//register events
			NetworkController.bindSystem('setViews', function(views) {
				console.log(views);
				for (var i in views) {
					if (!views[i]) { continue; }
					var newView = new View(parseInt(views[i].ID),
										   views[i].Title,
										   views[i].HTML,
										   views[i].JS,
										   views[i].path);
					this.addView(newView);
				}
			}.bind(this));
			NetworkController.bindSystem('addView', function(view) {
				var newView = new View(parseInt(view.ID),
									   view.Title,
									   view.HTML,
									   view.JS,
									   view.path);
				this.addView(newView);
			}.bind(this));
			NetworkController.bindSystem('close', function() {
				this.clear();
			}.bind(this));
		},
		/*
		 *	@param {View} view
		 */
		addView : function(view) {
			this.Views.push(view);
			console.log(view.$container);
			$content.append(view.$container);
//			$('#master-content').append(view.$container);
			view.load();
		},
		clear : function() {
			for (var i in this.Views) {
				this.Views[i].kill();
//				SidebarManager.remove(this.Views[i]);
			}
			SidebarManager.clear();
			this.Focus = null;
			this.Views = [];
		},
		setFocus : function(ID) {
			if (this.Focus !== null) {
				this.getViewByID(this.Focus).$container.removeClass('focus');
			}
			this.Focus = ID;
			this.getViewByID(ID).$container.addClass('focus');
		},
		getViewByID : function (ID) {
			for (var i in this.Views) {
				if (this.Views[i].ID === ID) {
					return this.Views[i]
				}
			}
		},
	};



	return function init() {
		$content = $('#master-content');
		$sidebar = $('#master-sidebar');
		NetworkController.init();
		//send loadViews
		NetworkController.sendSystem('getViews');
		SidebarManager.init();
		ViewManager.init();
		bracketsConnect = {
			//puplic api
		}
	}
})();
$(document).ready(function() {
	bracketsConnect();
});
