/*globals createjs:true*/
var Class = require('../core/Class.js');
var Bullet = require('./Bullet.js');
var Eventmanager = require('./EventManager.js');

module.exports = (function(){

	var Player = Class.extend({
		init: function(x, y, friction, type, speed, strength) {
			this.event = new Eventmanager(this);
			this.x = x;
			this.y = y;
			this.friction = friction;
			this.speed = 0;
			this.maxspeed = speed;
			this.rotation = 0;
			this.velX = 0;
			this.velY = 0;
			this.bullets = [];
			this.health = 20 * strength;
			this.shieldUsed = false;
			this.shield = false;

			this.spritesheeturl = "../images/sprites/";

			this.displayobject = new createjs.Container();

			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.spritesheeturl += type + ".png";
			
			if(type === "spud") {
				this.framewidth = 85;
			}else{
				this.framewidth = 83;
			}

			console.log('TYPE ROBOT: ', this.spritesheeturl);
			this.loadGraphics();

		},

		loadGraphics: function() {
			//spritesheet van de speler inladen
			var rect = new createjs.Shape();
			rect.graphics.beginFill("orange").drawRect(0, 0, 80, 80);

			this.displayobject.regX = 0;
			this.displayobject.regY = 0;

			var spritesheet = new createjs.SpriteSheet({
				"images":[this.spritesheeturl],
				"frames": {"width": this.framewidth, "height": 81, "count":5, "regX": 41.5, "regY": 40.5},
				"animations": {
					drive: {
						frames:[2, 3, 4, 2],
						speed: 0.1
					},
					hit: {
						frames: [0,1],
						next: "drive",
						speed: 0.1
					}
				}
			});

			this.playerSprite = new createjs.Sprite(spritesheet, "drive");
			this.playerSprite.x = 40;
			this.playerSprite.y = 40;
			this.displayobject.addChild(this.playerSprite);
			this.displayobject.width = this.width = 80;
			this.displayobject.height = this.height = 80;

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

		attack: function(type, snelheid, kracht) {
				this.bulletdamage = kracht;
				var bullet = new Bullet(this.x + 40, this.y + 40, this.rotation, type, snelheid, kracht);
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

		useShield: function() {
			if(!(this.shieldUsed))
			{
				this.shieldUsed = true;
				this.shield = true;
				this.shieldbitmap = new createjs.Bitmap("../images/sprites/shield.png");
				this.shieldbitmap.regX = 110;
				this.shieldbitmap.regY = 110;
				this.shieldbitmap.x =  41.5;
				this.shieldbitmap.y = 40.5;
				this.displayobject.addChild(this.shieldbitmap);
				setTimeout((function(){
					this.shield=false;
					this.displayobject.removeChild(this.shieldbitmap);
				}).bind(this), 10000);
			}
		},
	});

	return Player;

})();