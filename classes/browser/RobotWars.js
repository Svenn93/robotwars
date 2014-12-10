/*globals createjs:true*/
var Class = require('../core/Class.js');
var World = require('./World.js');
var TileMap = require('./TileMap.js');
var Bound = require('./Bound.js');
var Player = require('./Player.js');
var CollisionDetection = require('./CollisionDetection.js');
var Bullet = require('./Bullet.js');

var keys = [];
var joyStick1 = {};

module.exports = (function(){

	var RobotWars = Class.extend({

		init: function($el) {
			this.initSocket();
			//GAME LOGICA
			this.$el = $el;
			this.collisionboxes = [];
			this.boxes = [];
			this.keys = [];
			this.joyStick1 = {};
			this.mapid = 1;
			this.player1Projectiles = [];
			this.collisionDetection = new CollisionDetection();

			this.stage = new createjs.Stage('cnvs');
			this.width = this.stage.canvas.width;
			this.height = this.stage.canvas.height;

			this.world = new World(this.width, this.height);

			this.world.boundH = - (this.world.height - this.height);
			this.world.boundW = - (this.world.width - this.width);
			
			this.initializeMap();

			var shape1 = new createjs.Shape();
            shape1.graphics.beginFill(createjs.Graphics.getRGB(0,255,0));
            shape1.graphics.drawCircle(200,200,200);

			this.stage.addChild(this.world.container);
			
			document.fullscreenEnabled = document.fullscreenEnabled || 
			 							 document.webkitFullscreenEnabled || 
			 							 document.mozFullScreenEnabled ||
			 							 document.msFullscreenEnabled;

			document.body.requestFullscreen = this.$el[0].requestFullscreen || 
										 this.$el[0].webkitRequestFullscreen || 
										 this.$el[0].mozRequestFullscreen || 
										 this.$el[0].msRequestFullscreen;

			this.$el.on('click', function(e){
				document.body.requestFullscreen();
			});

			window.onkeydown = this.keydown;
			window.onkeyup = this.keyup;
		},

		initSocket: function() {
			console.log('[RobotWars] INIT SOCKET');
			this.socket = io('/');

			this.socket.on('socketid', function(data){
				this.socketid = data;
				console.log('[RobotWars] socketid: ', this.socketid);
			});

			this.socket.on('userinput', (function(data){
				for (var key in data){
					joyStick1[key] = data[key];
				}

				if(joyStick1["fire"]) {
					this.attack(1);
				}

				//console.log(data);
			}).bind(this));
		},

		initializeMap: function() {
			console.log('Initalize Map: ', this);
			if(typeof this.map !== 'undefined') {
				console.log('er is een map');
			}

			this.map = new TileMap(this.mapid, this.$el);
			this.map.event.observe('maploaded', this.mapLoadedHandler.bind(this));
		},

		mapLoadedHandler: function() {
			console.log('mapje geladen: ', this.map.displayobject);

			this.boxes.length = 0;
			this.collisionboxes.length = 0;

			this.buildBounds();
			this.world.addChild(this.map.displayobject);
			this.stage.update();

			this.spawnX1 = this.map.spawnX1;
			this.spawnY1 = this.map.spawnY1;
			this.spawnX2 = this.map.spawnX2;
			this.spawnY2 = this.map.spawnY2;

			this.collisionboxes = this.map.collisionboxes;
			this.boxes = this.map.boxes;

			this.player1 = new Player(this.spawnX1, this.spawnY1, this.world.friction);
			this.world.container.addChild(this.player1.displayobject);

			this.player2 = new Player(this.spawnX2, this.spawnY2, this.world.friction);
			this.world.container.addChild(this.player2.displayobject);

			this.ticker = createjs.Ticker;
			this.ticker.setFPS('60');
			this.ticker.addEventListener('tick', this.update.bind(this));
		},

		attack: function(player) {
			if(player === 1){
				console.log('player 1 attacks');
				var bullet = new Bullet(this.player1.x, this.player1.y, this.player1.rotation);
				this.world.container.addChild(bullet.displayobject);
				this.player1Projectiles.push(bullet);
			}
		},

		update: function() {

			for (var i = 0; i < this.collisionboxes.length; i++) {
				if(this.collisionDetection.checkCollision(this.player1, this.collisionboxes[i])) {
					console.log("colission");
					this.player1.speed = 0;
				}
			}

			if(keys[37] || joyStick1["left"]){
				//this.player.velX--;
				this.player1.rotation -= 2;
			}

			if(keys[39] || joyStick1["right"]) {
				//this.player.velX++;
				this.player1.rotation += 2;
			}

			if(keys[38] || joyStick1["up"]) {
				//this.player.velY--;
				if(this.player1.speed < 3)
				{
					this.player1.speed ++;
				}
			}

			if(keys[40] || joyStick1["down"]) {
				this.player1.velY++;
				if(this.player1.speed > -3)
				{
					this.player1.speed --;
				}
			}

			//console.log('p1p: ', this.player1Projectiles);

			for(var j = 0; j < this.player1Projectiles.length; j++) {
				var collision = false;
				for (var f = 0; f < this.collisionboxes.length; f++) {
					if(this.collisionDetection.checkCollision(this.player1Projectiles[j], this.collisionboxes[f])) {
						collision = true;
						this.world.container.removeChild(this.player1Projectiles[j].displayobject);
						this.player1Projectiles.splice(j,1);
						console.log('de array: ', this.player1Projectiles);
						break;
					}
				}
				//mag niet meer geupdate worden als er collision is, is al verwijderd uit de array
				if(!collision)
				{
					this.player1Projectiles[j].update();
				}
			}

			this.player1.update();
			this.stage.update();
		},

		buildBounds: function() {
			this.collisionboxes.push(new Bound(0, this.world.height-1, this.world.width, 1));
			//boxes.push(new Bound(0, 0, world.width, 1));
			this.collisionboxes.push(new Bound(0, 0, 1, this.world.height));
			this.collisionboxes.push(new Bound(this.world.width-1, 0, 1, this.world.height));
		},

		keyup: function(event) {
			keys[event.keyCode] = false;
		},

		keydown: function(event) {
			keys[event.keyCode] = true;
			console.log(keys[event.keyCode]);
		},
	});

	return RobotWars;

})();
