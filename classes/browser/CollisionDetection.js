var Class = require('../core/Class.js');

module.exports = (function(){

	var CollisionDetection = Class.extend({
		init: function() {

		},

		checkCollision: function(shapeA, shapeB){
			var vX = (shapeA.x + (shapeA.width/2)) - (shapeB.x + (shapeB.width/2));
			var vY = (shapeA.y + (shapeA.height/2)) - (shapeB.y + (shapeB.height/2));
			var hWidths = (shapeA.width/2) + (shapeB.width/2);
			var hHeights = (shapeA.height/2) + (shapeB.height/2);

			if(Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
				var oX = hWidths - Math.abs(vX);
				var oY = hHeights - Math.abs(vY);

				console.log('ja collision');
				//console.log('ShapeA: ', shapeA, 'ShapeB: ', shapeB);

				if(oX >= oY )
				{ 
					if(vY > 0) {
						shapeA.y += oY;

					}else {
						shapeA.y -= oY;
					}
					return true;

				}else {

					if(vX > 0) {
						shapeA.x += oX;
					}else {
						shapeA.x -= oX;
					}
					return true;
				}
			}

			return false;
		},
	});

	return CollisionDetection;

})();