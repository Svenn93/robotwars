var Class = require('../core/Class.js');

module.exports = (function(){

	var World = Class.extend({
		init: function(width, height) {
			this.boundH;
			this.boundW;

			this.friction = 0.8;
			this.width = width;
			this.height = height;
			this.container = new createjs.Container();
		},

		addChild: function(element) {
			this.container.addChild(element);
		},
	});

	return World;

})();
