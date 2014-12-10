/*globals createjs:true*/
var Class = require('../core/Class.js');

module.exports = (function(){

	var Player = Class.extend({
		init: function(x, y, friction) {
			this.x = x;
			this.y = y;
			this.friction = friction;
			this.speed = 0;
			this.rotation = 0;

			this.displayobject = new createjs.Container();

			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.loadGraphics();
		},

		loadGraphics: function() {
			//spritesheet van de speler inladen
			var rect = new createjs.Shape();
			rect.graphics.beginFill("orange").drawRect(0, 0, 30, 30);
			this.displayobject.addChild(rect);

			this.displayobject.width = this.width = 30;
			this.displayobject.height = this.height = 30;
			this.displayobject.rotation = this.rotation;

			//this.displayobject.regX = 15;
			//this.displayobject.regY = 15;

			console.log("this: ", this);
			console.log("Bounds: ", this.displayobject.getBounds());

    		//this.displayobject.width = this.width = 30;
    		//this.displayobject.height = this.height = 30;

			//circle = new createjs.Shape();
    		//circle.graphics.beginFill("blue").drawCircle(0, 0, 15);
    		//this.displayobject.addChild(circle);

    		//circle2 = new createjs.Shape();
    		//circle2.graphics.beginFill("yellow").drawCircle(10, 0, 3);
    		//this.displayobject.addChild(circle2);
		},

		update: function() {
			//this.x += this.velX;
			//this.y += this.velY;
			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.speed *= this.friction;
			if(this.speed < 0.1)
			{
				this.speed = 0;
			}

			if(this.rotation <= 0 && this.rotation >= -2)
			{
				this.rotation = 360;
			}else if(this.rotation > 360 && this.rotation <= 362){
				this.rotation = 0;
			}

			var directionVector = [];
			var accelerationVector = [];
			directionVector["x"] = Math.cos(this.rotation * Math.PI/180);
			directionVector["y"] = Math.sin(this.rotation * Math.PI/180);

			//console.log('direction x: ', directionVector["x"]);
			//console.log('direction y: ', directionVector["y"]);
			//console.log('rotation: ', this.rotation);


			accelerationVector["x"] = directionVector["x"] * this.speed;
			accelerationVector["y"] = directionVector["y"] * this.speed;

			//console.log("speed: ", this.speed, "accVector x: ", accelerationVector["x"], "accVector y: ", accelerationVector["y"]);

			this.displayobject.rotation = this.rotation;

			//console.log("heading: ", this.rotation, " and rotation: ", this.displayobject.rotation);

			this.displayobject.x += accelerationVector["x"];
			this.displayobject.y += accelerationVector["y"];

			this.x = this.displayobject.x;
			this.y = this.displayobject.y;

			this.velX *= this.friction;
			this.velY *= this.friction;
		},
	});

	return Player;

})();