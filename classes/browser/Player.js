var Class = require('../core/Class.js');

module.exports = (function(){

	var Player = Class.extend({
		init: function(x, y, friction) {
			this.x = x;
			this.y = y;
			this.velX = 0;
			this.velY = 0;
			this.friction = friction;
			this.speed = 3;

			this.displayobject = new createjs.Container();
			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.loadGraphics();
		},

		loadGraphics: function() {
			//spritesheet van de speler inladen

			circle = new createjs.Shape();
    		circle.graphics.beginFill("red").drawCircle(0, 0, 40);
    		this.displayobject.addChild(circle);

    		this.displayobject.width = this.width = 40;
    		this.displayobject.height = this.height = 40;
		},

		update: function() {
			this.x += this.velX;
			this.y += this.velY;

			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.velX *= this.friction;
			this.velY *= this.friction;
		},
	});

	return Player;

})();