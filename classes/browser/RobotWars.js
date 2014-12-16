/*globals createjs:true*/
var Class = require('../core/Class.js');
var World = require('./World.js');
var TileMap = require('./TileMap.js');
var Bound = require('./Bound.js');
var Player = require('./Player.js');
var CollisionDetection = require('./CollisionDetection.js');
var Bullet = require('./Bullet.js');
var Healthbar = require('./Healthbar.js');
var TimeIndicator = require('./TimeIndicator.js');

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

			window.onkeydown = (this.keydown).bind(this);
			window.onkeyup = (this.keyup).bind(this);
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
					this.player1.attack(1);
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
			this.player1.event.observe('playerHit', (this.player1HitPlayer).bind(this));
			this.world.container.addChild(this.player1.displayobject);

			this.player2 = new Player(this.spawnX2, this.spawnY2, this.world.friction);
			this.player2.event.observe('playerHit', (this.player2HitPlayer).bind(this));
			this.world.container.addChild(this.player2.displayobject);

			this.healthbar1 = new Healthbar(0, 700, "links", "player 1");
			this.world.container.addChild(this.healthbar1.displayobject);

			this.healthbar2 = new Healthbar(950, 700, "rechts", "player 2");
			this.world.container.addChild(this.healthbar2.displayobject);

			this.timeindicator = new TimeIndicator(575, 700);
			this.world.container.addChild(this.timeindicator.displayobject);

			this.ticker = createjs.Ticker;
			this.ticker.setFPS('60');
			this.fn = this.update.bind(this);
			this.ticker.addEventListener('tick', this.fn);

			this.interval = setInterval((this.countdown).bind(this), 1000);
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

				if(this.collisionDetection.checkCollision(this.player2, this.collisionboxes[i])) {
					this.player2.speed = 0;
				}
			}

			if(this.collisionDetection.checkPlayerCollision(this.player1, this.player2)){
				this.player1.speed = 0;
				this.player2.speed = 0;
			}

			//PLAYER 1

			if(keys[37] || joyStick1["left"]){
				this.player1.rotation -= 2;
			}

			if(keys[39] || joyStick1["right"]) {
				this.player1.rotation += 2;
			}

			if(keys[38] || joyStick1["up"]) {
				if(this.player1.speed < 3)
				{
					this.player1.speed ++;
				}
			}

			if(keys[40] || joyStick1["down"]) {
				if(this.player1.speed > -3)
				{
					this.player1.speed --;
				}
			}

			//PLAYER 2
			if(keys[81] || joyStick1["left"]){
				this.player2.rotation -= 2;
			}

			if(keys[68] || joyStick1["right"]) {
				this.player2.rotation += 2;
			}

			if(keys[90] || joyStick1["up"]) {
				if(this.player2.speed < 3)
				{
					this.player2.speed ++;
				}
			}

			if(keys[83] || joyStick1["down"]) {
				if(this.player2.speed > -3)
				{
					this.player2.speed --;
				}
			}

			for(var j = 0; j < this.player1.bullets.length; j++) {
					this.player1.bullets[j].update(this.collisionboxes, this.player2);
			}

			for(var k = 0; k < this.player2.bullets.length; k++) {
					this.player2.bullets[k].update(this.collisionboxes, this.player1);
			}

			this.player1.update();
			this.player2.update();
			this.timeindicator.update();
			this.stage.update();
		},

		buildBounds: function() {
			this.collisionboxes.push(new Bound(0, this.world.height-1, this.world.width, 1));
			//boxes.push(new Bound(0, 0, world.width, 1));
			this.collisionboxes.push(new Bound(0, 0, 1, this.world.height));
			this.collisionboxes.push(new Bound(this.world.width-1, 0, 1, this.world.height));
		},

		keyup: function(event) {
			if(event.keyCode == 32){
				//debug
				this.player1.attack("bullet");
			}

			if(event.keyCode == 16) {
				this.player2.attack("bullet");
			}
			keys[event.keyCode] = false;
		},

		keydown: function(event) {
			//console.log(event.keyCode);
			keys[event.keyCode] = true;
		},

		player1HitPlayer: function() {
			this.player2.health -= 1;
			this.healthbar2.health = this.player2.health;
			this.healthbar2.loadGraphics();
			console.log(this.player2.health);
		},

		player2HitPlayer: function() {
			this.player1.health -= 1;
			this.healthbar1.health = this.player1.health;
			this.healthbar1.loadGraphics();
			console.log(this.player1.health);
		},

		countdown: function() {
			if(this.timeindicator.seconds > 0) {
				this.timeindicator.seconds -=1; 
			}else {
				clearInterval(this.interval);
				this.endGame();
			}
		},

		endGame: function() {
			console.log('END GAME');
			this.ticker.removeEventListener('tick', this.fn);
		},
	});

	return RobotWars;

})();
