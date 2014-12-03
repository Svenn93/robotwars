(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./_js/app.js":[function(require,module,exports){
var RobotWars = require('../classes/browser/RobotWars.js');
new RobotWars($('#cnvs'));
},{"../classes/browser/RobotWars.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/RobotWars.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/Bound.js":[function(require,module,exports){
var Class = require('../core/Class.js');

module.exports = (function(){

	var Bound = Class.extend({

		init: function(x, y, width, height){
			this.x = x;
        	this.y = y;
        	this.width = width;
        	this.height = height;
		}, 
	});

	return Bound;

})();
},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/Eventmanager.js":[function(require,module,exports){
var Class = require('../core/Class.js');

module.exports = (function(){

	var Eventmanager = Class.extend({

		init: function(target){
			this.target = target || window,
        	this.events = {};
		}, 

		observe: function(eventName, cb) {
			if (this.events[eventName]) this.events[eventName].push(cb);
        	else this.events[eventName] = new Array(cb);
        	return this.target;
		},

		stopObserving: function(eventName, cb) {
			if (this.events[eventName]) {
            	var i = this.events[eventName].indexOf(cb);
            	if (i > -1) this.events[eventName].splice(i, 1);
            	else return false;
            	return true;
        	}
        	else return false;
		},

		fire: function(eventName) {
			if (!this.events[eventName]) return false;
        	for (var i = 0; i < this.events[eventName].length; i++) {
            	this.events[eventName][i].apply(this.target, Array.prototype.slice.call(arguments, 1));
        	}
        },
	});

	return Eventmanager;

})();
},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/RobotWars.js":[function(require,module,exports){
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

},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js","./Bound.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Bound.js","./TileMap.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/TileMap.js","./World.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/World.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/Tile.js":[function(require,module,exports){
var Class = require('../core/Class.js');

module.exports = (function(){

	var Tile = Class.extend({
		init: function(sprite, tilewidth, tileheight) {
			this.sprite = sprite;
			this.width = tilewidth;
			this.height = tileheight;
			this.displayobject = new createjs.Container();
			this.x = this.displayobject.x = this.sprite.x;
			this.y = this.displayobject.y = this.sprite.y;
			this.displayobject.obj = this;
			this.displayobject.width = this.width;
			this.displayobject.height = this.height;
			this.sprite.x = 0;
			this.sprite.y = 0;
			this.displayobject.addChild(this.sprite);
		},
	});

	return Tile;

})();

},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/TileMap.js":[function(require,module,exports){
var Class = require('../core/Class.js');
var Tile = require ('./Tile.js');
var Eventmanager = require('./Eventmanager.js');

module.exports = (function(){

	var TileMap = Class.extend({
		init: function(mapid, el) {
			this.mapid = mapid;
			this.$el = el;
			this.mapData = "";
			this.collisionboxes = [];
			this.boxes = [];
			this.displayobject = new createjs.Container();
			this.tileset = new Image();
			this.tileset.src = '../maps/tileset.jpg';
			this.tileset.onLoad = this.draw();
			this.event = new Eventmanager(this);
		},

		draw: function(element) {
			console.log('DRAW: ', this.tileset);
			if(this.displayobject.children !== 0) {
				this.displayobject.removeAllChildren();
			}

			var jsonURL = '../maps/map' + this.mapid + '.json';

			$.get(jsonURL, this.jsonLoaded.bind(this));
		},

		jsonLoaded: function(data) {
			this.mapData = data;
			this.initLayers();
		},

		initLayers: function() {
			var w = this.mapData.tilesets[0].tilewidth;
			var h = this.mapData.tilesets[0].tileheight;

			var imageData = {
				images: [ this.tileset ],
				frames: {
					width: w,
					height: h
				}
			};

			var tilesetSheet = new createjs.SpriteSheet(imageData);

			for(var idx = 0; idx < this.mapData.layers.length; idx++) {
				var layerData = this.mapData.layers[idx];
				if(layerData.type === "tilelayer"){
					this.initLayer(layerData, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight);
				}
			}

			this.spawnX1 = this.mapData.spawnpoint1[0];
			this.spawnY1 = this.mapData.spawnpoint1[1];

			this.event.fire('maploaded');
			
		},

		initLayer: function(layerData, tilesetSheet, tilewidth, tileheight) {
			var platformteller = 0;
			for (var y = 0; y < layerData.height; y++) {
				for ( var x = 0; x < layerData.width; x++) {
					var cellBitmap = new createjs.Sprite(tilesetSheet);
					var idx = x + y * layerData.width;

					cellBitmap.gotoAndStop(layerData.data[idx] - 1);

					cellBitmap.x = x * tilewidth;
					cellBitmap.y = y * tileheight;
					
					if(layerData.data[idx] !== 0)
					{
						platformteller++;
						var name = "platform" + platformteller;
						var worldTile = "";
						switch (layerData.name)
						{
							case "world":
								worldTile = new Tile(cellBitmap, tilewidth, tileheight);
								this.displayobject.addChild(worldTile.displayobject);
								this.boxes.push(worldTile);
							break;

							case "collision":
								worldTile = new Tile(cellBitmap, tilewidth, tileheight);
								this.displayobject.addChild(worldTile.displayobject);
								this.collisionboxes.push(worldTile);
							break;
						}
					}
				}
			}
		},
	});

	return TileMap;

})();

},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js","./Eventmanager.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Eventmanager.js","./Tile.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Tile.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/World.js":[function(require,module,exports){
var Class = require('../core/Class.js');

module.exports = (function(){

	var World = Class.extend({
		init: function(width, height) {
			this.boundH;
			this.boundW;

			this.friction = 0.8;
			this.width = width;
			this.height = height;
			this.container = new createjs.Container();
		},

		addChild: function(element) {
			this.container.addChild(element);
		},
	});

	return World;

})();

},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js":[function(require,module,exports){
/* jshint ignore:start */
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
module.exports = (function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
  return Class;
})();
/* jshint ignore:end */
},{}]},{},["./_js/app.js"]);
