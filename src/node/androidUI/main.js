var bracketsConnect = (function() {
	var $sidebar,
		$content;

	var NetworkController = {
		connected : false,
		listeners : {},

		init : function(ip, port) {
			var socket = io.connect(),
				self = this;

			socket.on('system', function (data) {
				if ('type' in data) {
//					console.log('system incoming:', data, self);
					self.notify.call(self, data.type, data.data);
				}
			});

			socket.on('comand', function (data) {
				if ('type' in data) {
					self.notify.call(self, data.type, data.data, data.viewID);
				}
			});
		},
		sendPackage : function (type, data) {
			var pack = {
				type : type,
				data : data
			};
			this.sendData(pack);
		},
		bind : function(type, callback) {
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

		sendData : function (data) {
			if (!this.connected) { return false; }
			//ws.send(JSON.stringify(data));
		},
	};

	var View = function(id, title, html, js) {
		this.ID = id;
		this.Title = title || 'undefined';
		this.HTML = html;
		this.JS = js;
		this.$container = $('<div class="view" name="' + title + '"></div>');
		this.$container.html(html);
	}
	View.prototype.load = function() {
		SidebarManager.register(this);
		//create space and run code
		(function(View) {
			//kill all vars
			console.log('eval buhahahaha');
			eval(View.JS);

		})(this);
	};

	var SidebarManager = {
		buttons : [],

		init : function() {
			$sidebar.click(function(e) {
				if ($(e.target).hasClass('button') && $(e.target).attr('name')) {
					this.trigger(parseInt($(e.target).attr('name')) );
				}
			}.bind(this));
		},
		register : function(view) {
			var $button = $('<div class="button" name="' + view.ID + '">dsa</div>');
			this.buttons.push({
				id : view.ID,
				$ele : $button,
				view : view
			});
			$sidebar.append($button);
		},
		trigger : function(ID) {
			console.log('clickt on ', ID)
			ViewManager.setFocus(ID);
		},

	};
	/*	show/hide content | build secure enviremnent
	 *	@class
	 */
	var ViewManager = {
		Views : [],
		Focus : null,

		init : function() {
			//register events
			NetworkController.bind('resetViews', function(views) {
				for (var i=0;i<views.length;i++) {
					var newView = new View(parseInt(views[i].ID), views[i].Title,  views[i].HTML, views[i].JS);
					this.addView(newView);
				}
			}.bind(this));
		},
		/*
		 *	@param {View} view
		 */
		addView : function(view) {
			this.Views.push(view);
			$content.append(view.$container);
			view.load();
		},
		setFocus : function(ID) {
			if (this.Focus !== null) {
				this.getViewByID(this.Focus)
					.$container.removeClass('focus');
			}
			this.Focus = ID;
			this.getViewByID(ID)
				.$container.addClass('focus');
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
