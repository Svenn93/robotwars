var Class = require('../core/Class.js');
var World = require('./World.js');
var TileMap = require('./TileMap.js');
var Bound = require('./Bound.js');
var Player = require('./Player.js');

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
			this.map;
			this.ticker;
			this.player;

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

			this.$el[0].requestFullscreen = this.$el[0].requestFullscreen || 
										 this.$el[0].webkitRequestFullscreen || 
										 this.$el[0].mozRequestFullscreen || 
										 this.$el[0].msRequestFullscreen

			this.$el.on('click', function(e){
				this.requestFullscreen();
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

			this.socket.on('userinput', function(data){
				for (var key in data){
					joyStick1[key] = data[key];
				}

				console.log(data);
			});
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
			this.spawnX = this.map.spawnX1;
			this.spawnY = this.map.spawnY1;

			this.collisionboxes = this.map.collisionboxes;
			this.boxes = this.map.boxes;

			if(typeof this.player !== 'undefined') {
				player.x = this.spawnX;
				player.y = this.spawnY;
				world.container.setChildIndex(this.player.displayobject, this.world.container.getNumChildren() - 1);
			}else {
				this.player = new Player(this.spawnX, this.spawnY, this.world.friction);
				this.world.container.addChild(this.player.displayobject);
			}

			this.ticker = createjs.Ticker;
			this.ticker.setFPS('60');
			this.ticker.addEventListener('tick', this.update.bind(this));
		},

		update: function() {
			//console.log(joyStick1);
			if(keys[37] || joyStick1["left"]){
				//links
				this.player.rotation -= 2;
			}

			if(keys[39] || joyStick1["right"]) {
				this.player.rotation += 2;
			}

			if(keys[38] || joyStick1["up"]) {
				if(this.player.speed < 3)
				{
					this.player.speed ++;
				}
			}

			this.player.update();
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
