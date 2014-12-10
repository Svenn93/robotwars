/*globals createjs:true*/
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

			this.spawnX2 = this.mapData.spawnpoint2[0];
			this.spawnY2 = this.mapData.spawnpoint2[1];

			this.event.fire('maploaded');
			
		},

		initLayer: function(layerData, tilesetSheet, tilewidth, tileheight) {
			for (var y = 0; y < layerData.height; y++) {
				for ( var x = 0; x < layerData.width; x++) {
					var cellBitmap = new createjs.Sprite(tilesetSheet);
					var idx = x + y * layerData.width;

					cellBitmap.gotoAndStop(layerData.data[idx] - 1);

					cellBitmap.x = x * tilewidth;
					cellBitmap.y = y * tileheight;
					
					if(layerData.data[idx] !== 0)
					{
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
