/*globals createjs:true*/
var Class = require('../core/Class.js');
var Bullet = require('./Bullet.js');

module.exports = (function(){

	var Player = Class.extend({
		init: function(x, y, friction) {
			this.x = x;
			this.y = y;
			this.friction = friction;
			this.speed = 0;
			this.rotation = 0;
			this.velX = 0;
			this.velY = 0;
			this.bullets = [];

			this.displayobject = new createjs.Container();

			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.loadGraphics();
		},

		loadGraphics: function() {
			//spritesheet van de speler inladen
			var rect = new createjs.Shape();
			rect.graphics.beginFill("orange").drawRect(0, 0, 80, 80);
			this.displayobject.addChild(rect);

			/*this.displayobject.width = this.width = 30;
			this.displayobject.height = this.height = 30;
			this.displayobject.rotation = this.rotation;*/

			this.displayobject.regX = 0;
			this.displayobject.regY = 0;

			/*console.log("this: ", this);
			console.log("Bounds: ", this.displayobject.getBounds());*/

			var spritesheet = new createjs.SpriteSheet({
				"images":["../images/robot.png"],
				"frames": {"width": 83, "height": 81, "count":8, "regX": 41.5, "regY": 40.5},
				"animations": {
					drive: {
						frames:[0, 1, 2, 3],
						speed: 0.1
					},
					idle: {
						frames: [3]
					}
				}
			});

			this.playerSprite = new createjs.Sprite(spritesheet, "drive");
			this.playerSprite.x = 40;
			this.playerSprite.y = 40;
			this.displayobject.addChild(this.playerSprite);
			this.displayobject.width = this.width = 80;
			this.displayobject.height = this.height = 80;

			console.log("Sprite: ", this.playerSprite);

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

			//wanneer de x-waarde wordt aangepast in een collision, displayobject x gelijkzetten
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

			accelerationVector["x"] = directionVector["x"] * this.speed;
			accelerationVector["y"] = directionVector["y"] * this.speed;

			//console.log("speed: ", this.speed, "accVector x: ", accelerationVector["x"], "accVector y: ", accelerationVector["y"]);

			this.playerSprite.rotation = this.rotation;

			//console.log("heading: ", this.rotation, " and rotation: ", this.displayobject.rotation);

			this.displayobject.x += accelerationVector["x"];
			this.displayobject.y += accelerationVector["y"];

			this.x = this.displayobject.x;
			this.y = this.displayobject.y;
		},

		attack: function(type) {
			switch(type){
				case 'bullet':
				var bullet = new Bullet(this.x, this.y, this.rotation);
				var world = this.displayobject.parent;
				bullet.index = (this.bullets.length > 0) ? this.bullets.length : 0;
				this.bullets.push(bullet);

				var callback = (function(){
					//console.log('callback', this);
					this.bulletHitBound(bullet);
				}).bind(this);

				bullet.callback = callback;
				bullet.event.observe('boundsHit', callback);

				world.addChild(bullet.displayobject);
				break;
			}
		},

		bulletHitBound: function(bullet) {
			this.bullets[this.bullets.indexOf(bullet)].event.stopObserving('boundsHit', this.bullets[this.bullets.indexOf(bullet)].callback);
			var world = this.displayobject.parent;
			world.removeChild(this.bullets[this.bullets.indexOf(bullet)].displayobject);
			this.bullets.splice(this.bullets.indexOf(bullet), 1);
		},
	});

	return Player;

})();