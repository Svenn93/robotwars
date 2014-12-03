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