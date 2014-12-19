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
var joyStick2 = {};



var longweapons = [
	["s-34", 4, 2],
	["kx-93", 2, 5],
	["kg-43", 3, 3]
]

module.exports = (function(){

	var RobotWars = Class.extend({

		init: function($el, robot1, robot2, weapon1, weapon2) {
			console.log("INIT: ", robot1, robot2, weapon1, weapon2);
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
			this.robot1 = robot1;
			this.robot2 = robot2;
			this.weapon1 = weapon1;
			this.weapon2 = weapon2;
			this.robots = [
				["crowby", 3, 4],
				["crank", 2, 5],
				["spud",5, 2]
			]

			this.longweapons = [
				["s-34", 4, 2],
				["kx-93", 2, 5],
				["kg-43", 3, 3]
			]

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

			this.socket.on('userinput1', (function(data){
				for (var key in data){
					joyStick1[key] = data[key];
				}

				if(joyStick1["longrange"]) {
					this.player1.attack(this.longweapons[this.weapon1][0], this.longweapons[this.weapon1][1], this.longweapons[this.weapon1][2]);
				}

				if(joyStick1["shield"]) {
					this.player1.useShield();
				}

				if(this.end && joyStick1["longrange"] && joyStick2["longrange"]) {
					document.getElementById('cnvs').dispatchEvent(event);				
				}

			}).bind(this));

			this.socket.on('userinput2', (function(data){
				for (var key in data){
					joyStick2[key] = data[key];
				}

				if(joyStick2["longrange"]) {
					this.player2.attack(this.longweapons[this.weapon2][0], this.longweapons[this.weapon2][1], this.longweapons[this.weapon2][2]);
				}

				if(joyStick2["shield"]) {
					this.player2.useShield();
				}

				if(this.end && joyStick1["longrange"] && joyStick2["longrange"]) {
					document.getElementById('cnvs').dispatchEvent(event);				
				}

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

			//console.log('mapLoadedHandler, robots: ', robots[this.robot1][0]);

			this.player1 = new Player(this.spawnX1, this.spawnY1, this.world.friction, this.robots[this.robot1][0], this.robots[this.robot1][1], this.robots[this.robot1][2]);
			this.player1.event.observe('playerHit', (this.player1HitPlayer).bind(this));
			this.world.container.addChild(this.player1.displayobject);

			this.player2 = new Player(this.spawnX2, this.spawnY2, this.world.friction, this.robots[this.robot2][0], this.robots[this.robot2][1], this.robots[this.robot2][2]);
			this.player2.event.observe('playerHit', (this.player2HitPlayer).bind(this));
			this.world.container.addChild(this.player2.displayobject);

			this.healthbar1 = new Healthbar(0, 700, "links", "player 1", this.player1.health);
			this.world.container.addChild(this.healthbar1.displayobject);

			this.healthbar2 = new Healthbar(950, 700, "rechts", "player 2", this.player2.health);
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
				if(this.player1.speed < this.player1.maxspeed)
				{
					this.player1.speed ++;
				}
			}

			if(keys[40] || joyStick1["down"]) {
				if(this.player1.speed > -(this.player1.maxspeed))
				{
					this.player1.speed --;
				}
			}

			//PLAYER 2
			if(keys[81] || joyStick2["left"]){
				this.player2.rotation -= 2;
			}

			if(keys[68] || joyStick2["right"]) {
				this.player2.rotation += 2;
			}

			if(keys[90] || joyStick2["up"]) {
				if(this.player2.speed < (this.player2.maxspeed))
				{
					this.player2.speed ++;
				}
			}

			if(keys[83] || joyStick2["down"]) {
				if(this.player2.speed > -(this.player2.maxspeed))
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
				this.player1.attack(this.longweapons[this.weapon1][0], this.longweapons[this.weapon1][1], this.longweapons[this.weapon1][2]);
			}

			if(event.keyCode == 16) {
				this.player2.attack(this.longweapons[this.weapon2][0], this.longweapons[this.weapon2][1], this.longweapons[this.weapon2][2]);
			}

			if(event.keyCode == 88)
			{
				this.player1.useShield();
			}
			keys[event.keyCode] = false;
		},

		keydown: function(event) {
			//console.log(event.keyCode);
			keys[event.keyCode] = true;

		},

		player1HitPlayer: function() {
			if(!this.player2.shield)
			{
				this.player2.playerSprite.gotoAndPlay('hit');
				this.player2.health -= this.player1.bulletdamage;
				this.healthbar2.health = this.player2.health;
				this.healthbar2.loadGraphics();
				console.log(this.player2.health);
				if(this.player2.health <=0 )
				{
					this.winner = "player 1"
					this.endGame();
				}
			}
		},

		player2HitPlayer: function() {
			if(!this.player1.shield)
			{
				this.player1.health -= this.player2.bulletdamage;
				this.player1.playerSprite.gotoAndPlay('hit');
				this.healthbar1.health = this.player1.health;
				this.healthbar1.loadGraphics();
				console.log(this.player1.health);
				if(this.player1.health <=0 )
				{
					this.winner = "player 2";
					this.endGame();
				}
			}
		},

		countdown: function() {
			if(this.timeindicator.seconds > 0) {
				this.timeindicator.seconds -=1; 
			}else {
				clearInterval(this.interval);
				if(this.player1.health < this.player2.health){
					this.winner = "player 2";
				}else{
					this.winner = "player 1";
				}
				this.endGame();
			}
		},

		endGame: function() {
			console.log('END GAME');
			var event = new Event('game-ended');
			this.ticker.removeEventListener('tick', this.fn);
			var overlay = new createjs.Shape();
			overlay.graphics.beginFill("black").drawRect(0, 0, this.width, this.height-200);
			overlay.alpha = 0.9;
			var bitmap = new createjs.Bitmap("../images/buttons.png");
			bitmap.x = 415;
			bitmap.y = 300;
			var text = new createjs.Text(this.winner, "20px Press Start K", "#14C92C");
			var text2 = new createjs.Text("WINNER", "54px Press Start K", "#14C92C");
			text.x = this.width/2 - 80;
			text.y = 150;
			text2.x = this.width/2 - 165;
			text2.y = 200;
			this.world.container.addChild(overlay);
			this.world.container.addChild(text);
			this.world.container.addChild(text2);
			this.world.container.addChild(bitmap);
			this.end = true;
		},
	});

	return RobotWars;

})();
