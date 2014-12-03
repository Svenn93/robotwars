var Class = require('../core/Class.js');
var World = require('./World.js');
var TileMap = require('./TileMap.js');
var Bound = require('./Bound.js');

module.exports = (function(){

	var RobotWars = Class.extend({

		init: function($el) {
			this.$el = $el;
			this.collisionboxes = [];
			this.boxes = [];
			this.mapid = 1;
			this.map;
			this.ticker;

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

			this.ticker = createjs.Ticker;
			this.ticker.setFPS('60');
			this.ticker.addEventListener('tick', this.update.bind(this));
		},

		update: function() {
			console.log('update');
			this.stage.update();
		},

		buildBounds: function() {
			this.collisionboxes.push(new Bound(0, this.world.height-1, this.world.width, 1));
			//boxes.push(new Bound(0, 0, world.width, 1));
			this.collisionboxes.push(new Bound(0, 0, 1, this.world.height));
			this.collisionboxes.push(new Bound(this.world.width-1, 0, 1, this.world.height));
		},
	});

	return RobotWars;

})();
