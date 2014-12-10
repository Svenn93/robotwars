/*globals createjs:true*/
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
