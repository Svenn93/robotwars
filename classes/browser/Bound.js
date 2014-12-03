var Class = require('../core/Class.js');

module.exports = (function(){

	var Bound = Class.extend({

		init: function(x, y, width, height){
			this.x = x;
        	this.y = y;
        	this.width = width;
        	this.height = height;
		}, 
	});

	return Bound;

})();