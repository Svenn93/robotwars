/*globals createjs:true*/
var Class = require('../core/Class.js');

module.exports = (function(){

	var Healthbar = Class.extend({
		init: function(x, y, plaatsing, text) {
			this.x = x;
			this.y = y;
			this.health = 100;
			this.plaatsing = plaatsing;
			this.text = new createjs.Text(text, "20px Arial", "white");

			this.displayobject = new createjs.Container();
			this.displayobject.addChild(this.text);
			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.healthbar = new createjs.Container();
			this.healthbar.y = 25;
			this.displayobject.addChild(this.healthbar);
			this.loadGraphics();
		},

		loadGraphics: function() {
			if(this.healthbar.getNumChildren() > 0) {
				this.healthbar.removeAllChildren();
			}
			var offset = 0;
			var aantalgekleurd = Math.round(this.health/4);
			console.log('aantal gekleurd: ', aantalgekleurd);
			for(var i= 1; i<= 25; i++)
			{
				var blokje = new createjs.Shape();
				var stroke = new createjs.Shape();
				blokje.graphics.beginFill("red").drawRoundRect(0, 0, 10, 32, 3);
				stroke.graphics.beginStroke("red").drawRoundRect(0, 0, 10, 32, 3);

				if(this.plaatsing === "links"){
					if(i<=aantalgekleurd){
						blokje.alpha = 1;
					}else{
						blokje.alpha = 0.1;
					}
				}else {
					if(i<= 25-aantalgekleurd){
						blokje.alpha = 0.1;
					}else{
						blokje.alpha = 1;
					}
				}
				
				stroke.x = offset;
				blokje.x = offset;
				this.healthbar.addChild(blokje);
				this.healthbar.addChild(stroke);
				offset += 16;
			}
		},
	});

	return Healthbar;

})();