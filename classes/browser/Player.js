/*globals createjs:true*/
var Class = require('../core/Class.js');
var Bullet = require('./Bullet.js');
var Eventmanager = require('./EventManager.js');

module.exports = (function(){

	var Player = Class.extend({
		init: function(x, y, friction) {
			this.event = new Eventmanager(this);
			this.x = x;
			this.y = y;
			this.friction = friction;
			this.speed = 0;
			this.rotation = 0;
			this.velX = 0;
			this.velY = 0;
			this.bullets = [];
			this.health = 100;

			this.displayobject = new createjs.Container();

			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.loadGraphics();
		},

		loadGraphics: function() {
			//spritesheet van de speler inladen
			var rect = new createjs.Shape();
			rect.graphics.beginFill("orange").drawRect(0, 0, 80, 80);

			this.displayobject.regX = 0;
			this.displayobject.regY = 0;

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
		},

		update: function() {

			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.speed *= this.friction;

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

			this.playerSprite.rotation = this.rotation;

			this.displayobject.x += accelerationVector["x"];
			this.displayobject.y += accelerationVector["y"];

			this.x = this.displayobject.x;
			this.y = this.displayobject.y;
		},

		attack: function(type) {
			switch(type){
				case 'bullet':
				var bullet = new Bullet(this.x + 40, this.y + 40, this.rotation);
				var world = this.displayobject.parent;
				bullet.index = (this.bullets.length > 0) ? this.bullets.length : 0;
				this.bullets.push(bullet);

				var callback = (function(){
					this.bulletHitBound(bullet);
				}).bind(this);

				var callback2 = (function(){
					this.otherPlayerHit(bullet);
				}).bind(this);

				bullet.boundHitCallback = callback;
				bullet.playerHitCallback = callback2;
				bullet.event.observe('boundsHit', callback);
				bullet.event.observe('otherPlayerHit', callback2);

				world.addChildAt(bullet.displayobject, world.getChildIndex(this.displayobject));
				break;
			}
		},

		bulletHitBound: function(bullet) {
			this.bullets[this.bullets.indexOf(bullet)].event.stopObserving('otherPlayerHit', this.bullets[this.bullets.indexOf(bullet)].otherPlayerHitCallback);
			this.bullets[this.bullets.indexOf(bullet)].event.stopObserving('boundsHit', this.bullets[this.bullets.indexOf(bullet)].boundHitCallback);
			var world = this.displayobject.parent;
			world.removeChild(this.bullets[this.bullets.indexOf(bullet)].displayobject);
			this.bullets.splice(this.bullets.indexOf(bullet), 1);
		},

		otherPlayerHit: function(bullet) {
			this.bullets[this.bullets.indexOf(bullet)].event.stopObserving('otherPlayerHit', this.bullets[this.bullets.indexOf(bullet)].otherPlayerHitCallback);
			this.bullets[this.bullets.indexOf(bullet)].event.stopObserving('boundsHit', this.bullets[this.bullets.indexOf(bullet)].boundHitCallback);

			var world = this.displayobject.parent;
			world.removeChild(this.bullets[this.bullets.indexOf(bullet)].displayobject);
			this.bullets.splice(this.bullets.indexOf(bullet), 1);

			this.event.fire('playerHit');
		},
	});

	return Player;

})();