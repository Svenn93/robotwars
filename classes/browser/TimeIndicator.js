/*globals createjs:true*/
var Class = require('../core/Class.js');

module.exports = (function(){

	var TimeIndicator = Class.extend({
		init: function(x, y) {
			this.x = x;
			this.y = y;
			this.seconds = 180;

			this.xmlurl = "../font/font.xml";

			this.displayobject = new createjs.Container();
			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			$.ajax({
		        type: "get",
		        url: this.xmlurl,
		        dataType: "xml",
		        context: this,
		        success: (function(data) {
		            /* handle data here */
		           this.bitmapfont = new BitmapFont("../font/font.png", data, 32);
		           BitmapTextField.registerBitmapFont(this.bitmapfont,"scorefont");
		           this.bitmapText = new BitmapTextField(200,100,"00","scorefont",-1,0,0,"left","top",true);
    			   this.displayobject.addChild(this.bitmapText);
		        }).bind(this)
		    });
		},

		update: function() {
			this.displayobject.removeChild(this.bitmapText);
			var minutes = Math.floor(this.seconds / 60);
			var seconds = this.seconds - minutes * 60;
			if(seconds === 0)
			{
				seconds = "00";
			}

			if((seconds <= 9) && seconds != 0)
			{
				seconds = "0" + seconds;
			}
			this.bitmapText = new BitmapTextField(200,100,minutes + ":" + seconds,"scorefont",-1,5,0,"left","top",true);
			this.displayobject.addChild(this.bitmapText);
		},
	});

	return TimeIndicator;

})();