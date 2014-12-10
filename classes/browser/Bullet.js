var Class = require('../core/Class.js');

module.exports = (function(){
	
	var Bullet = Class.extend({
		init: function(x, y, rotation){
			this.x = x;
			this.y = y;
			console.log('bulleeet');
			this.rotation = rotation;
			this.speed = 5;
			this.displayobject = new createjs.Container();
			this.width = 5;
			this.height = 5;

			this.displayobject.x = x;
			this.displayobject.y = y;
			this.displayobject.width = this.width;
			this.displayobject.height = this.height;
			var bullet = new createjs.Shape();
			bullet.graphics.beginFill("red").drawRect(0, 0, 5, 5);
			this.displayobject.addChild(bullet);
		},

		update: function() {
			var directionVector = [];
			var accelerationVector = [];
			directionVector["x"] = Math.cos(this.rotation * Math.PI/180);
			directionVector["y"] = Math.sin(this.rotation * Math.PI/180);

			accelerationVector["x"] = directionVector["x"] * this.speed;
			accelerationVector["y"] = directionVector["y"] * this.speed;

			this.x = this.displayobject.x += accelerationVector["x"];
			this.y = this.displayobject.y += accelerationVector["y"];
		}
	});

	return Bullet;
})();