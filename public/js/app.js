(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./_js/app.js":[function(require,module,exports){
var RobotWars = require('../classes/browser/RobotWars.js');
var step="splash";
var socket = "";
var socketid = "";
var joystick1 = {};
var joystick2 = {};
var selectedrobot1 = 0;
var selectedrobot2 = 0;
var selectedLRweapon1 = 0;
var selectedLRweapon2 = 0;
var isSet = false;
var videoEl = $('#qrvideo');
var qr = new QCodeDecoder();
var localStream;

var robots = [
	["crowby", 3, 4],
	["crank", 2, 5],
	["spud",5, 2]
]

var longweapons = [
	["s-34", 4, 2],
	["kx-93", 2, 5],
	["kg-43", 3, 3]
]

window.onkeydown = keyDownHandler;

document.fullscreenEnabled = document.fullscreenEnabled || 
 							 document.webkitFullscreenEnabled || 
 							 document.mozFullScreenEnabled ||
 							 document.msFullscreenEnabled;

document.body.requestFullscreen = document.body.requestFullscreen || 
								  document.body.webkitRequestFullscreen || 
							 	  document.body.mozRequestFullscreen || 
							 	  document.body.msRequestFullscreen;

$('body').on('click', function(e){
	document.body.requestFullscreen();
});


function init() {
	if(socket === "")
	{	
		initSocket();
	}
	$('#game').hide();
	$('#splash').show();
	$(".logo-groot").show();
	$('#choosebody').hide();
	$('#choices').hide();
	$('.versus').hide();
	$('#chooselongdistanceweapon').hide();
}

function initSocket() {
	socket = io('/');

	socket.on('socketid', function(data){
		socketid = data;
	});

	socket.on('userinput1', function(data){
		
		for (var key in data){
			joystick1[key] = data[key];
		}

		switch(step)
		{
			case "splash":
				if(joystick1['longrange'] && joystick2['longrange']){
					step = "chooseBodyP1";
					chooseBody();
				}
			break;

			case "chooseBodyP1": 
				if(joystick1['left']){
					if(selectedrobot1 > 0) {
						selectedrobot1-=1;
						setSelection();
					}
				}

				if(joystick1['right']){
					if(selectedrobot1 < 3) {
						selectedrobot1+=1;
						setSelection();
					}
				}

				if(joystick1['longrange']) {
					isSet = true;
					$("#choices .player1 ." + robots[selectedrobot1][0]).css('display', 'block');
					setTimeout(function(){
						step = "chooseBodyP2"; 
						chooseBody();
						isSet = false;
					}, 2000);
				}
			break;

			case "chooseLongDistanceWeaponsP1":
				if(joystick1['longrange']) {
					isSet = true;
					localStream.stop();
					$("#choices .player1 ." + longweapons[selectedLRweapon1][0]).css('display', 'block');
					setTimeout(function(){
						step = "chooseLongDistanceWeaponsP2"; 
						chooseLongDistanceWeapons();
						isSet = false;
					}, 2000);
				}
			break;
		}
	});

	socket.on('userinput2', function(data){
		for (var key in data){
			joystick2[key] = data[key];
		}

		switch(step)
		{
			case "splash":
				if(joystick1['longrange'] && joystick2['longrange']){
					step = "chooseBodyP1";
					chooseBody();
				}
			break;
			case "chooseBodyP2":
				if(joystick2['left']){
					if(selectedrobot2 > 0) {
						selectedrobot2-=1;
						setSelection();
					}
				}

				if(joystick2['right']){
					if(selectedrobot2 < 3) {
						selectedrobot2+=1;
						setSelection();
					}
				}

				if(joystick2['longrange']) {
					isSet=true;
					$("#choices .player2 ." + robots[selectedrobot2][0]).css('display', 'block');
					setTimeout(function(){
						step = "chooseLongDistanceWeaponsP1"; 
						chooseLongDistanceWeapons();
						isSet = false;
					}, 2000);
				}
			break;

			case "chooseLongDistanceWeaponsP2":
				if(joystick2['longrange'])
				{
					isSet = true;
					localStream.stop();
					$("#choices .player2 ." + longweapons[selectedLRweapon2][0]).css('display', 'block');
					setTimeout(function(){
						step = "startGame"; 
						startGame();
						isSet = false;
					}, 2000);
				}
			break;
		}
	});
}

function keyDownHandler(event) {
	console.log(event.keyCode, isSet);
	switch(event.keyCode)
	{
		case 32:
		if(!isSet){
			spacePressed();
		}
			break;
		case 37: 
		if(!isSet){
			leftPressed();
		}
			break;
		case 39:
		if(!isSet){
			rightPressed();
		}
			break; 
	}
}

function spacePressed() {

	switch(step) {
		case "splash": 
			step = "chooseBodyP1";
			chooseBody();
		break;
		case "chooseBodyP1":
			isSet = true;
			$("#choices .player1 ." + robots[selectedrobot1][0]).css('display', 'block');
			setTimeout(function(){
				step = "chooseBodyP2"; 
				chooseBody();
				isSet = false;
			}, 2000);
		break;
		case "chooseBodyP2":
			isSet = true;
			$("#choices .player2 ." + robots[selectedrobot2][0]).css('display', 'block');
			setTimeout(function(){
				step = "chooseLongDistanceWeaponsP1"; 
				chooseLongDistanceWeapons();
				isSet = false;
			}, 2000);
		break;
		case "chooseLongDistanceWeaponsP1":
			$("#choices .player1 ." + longweapons[selectedLRweapon1][0]).css('display', 'block');
			step = "chooseLongDistanceWeaponsP2";
			chooseLongDistanceWeapons();
		break;
		case "chooseLongDistanceWeaponsP2":
			$("#choices .player2 ." + longweapons[selectedLRweapon2][0]).css('display', 'block');
			step = "startGame";
			setTimeout(function(){
				startGame();
			}, 2000)
		break;
	}
}

function leftPressed() {
	if(step === "chooseBodyP1")
	{
		if(selectedrobot1 > 0)
		{
			selectedrobot1 -=1;
			setSelection();
		}
	}

	if(step === "chooseBodyP2")
	{
		if(selectedrobot2 > 0)
		{
			selectedrobot2 -=1;
			setSelection();
		}
	}

	if(step === "chooseLongDistanceWeaponsP1")
	{
		if (selectedLRweapon1 > 0)
		{
			selectedLRweapon1 -=1;
			setSelection();
		}
	}

	if(step === "chooseLongDistanceWeaponsP2")
	{
		if (selectedLRweapon2 < 0)
		{
			selectedLRweapon2 -=1;
			setSelection();
		}
	}

}

function rightPressed() {
	if(step === "chooseBodyP1")
	{
		if(selectedrobot1 < 3)
		{
			selectedrobot1 +=1;
			setSelection();
		}
	}

	if(step === "chooseBodyP2")
	{
		if(selectedrobot2 < 3)
		{
			selectedrobot2 +=1;
			setSelection();
		}
	}

	if(step === "chooseLongDistanceWeaponsP1")
	{
		if (selectedLRweapon1 < 3)
		{
			selectedLRweapon1 +=1;
			setSelection();
		}
	}

	if(step === "chooseLongDistanceWeaponsP2")
	{
		if (selectedLRweapon2 < 3)
		{
			selectedLRweapon2 +=1;
			setSelection();
		}
	}

}

function setSelection() {
	if(step === "chooseBodyP1") {
			switch(selectedrobot1) {
			case 0: $('#choosebody .player1 .selection').removeClass().addClass('selection0').addClass('selection');
				break;
			case 1: $('#choosebody .player1 .selection').removeClass().addClass('selection1').addClass('selection');
				break;
			case 2: $('#choosebody .player1 .selection').removeClass().addClass('selection2').addClass('selection');
				break;
		}

		$('#choosebody .player1 h1').html(robots[selectedrobot1][0]);
		$('#choosebody .player1 .snelheid').html('');
		$('#choosebody .player1 .sterkte').html('');
		for(var i= 1; i<=5; i++) {
			if(i<= robots[selectedrobot1][1]){
				var img = $("<img src='images/staticon_filled.png' />");
				$('#choosebody .player1 .snelheid').append(img);
			}else {
				var img = $("<img src='images/staticon.png' />");
				$('#choosebody .player1 .snelheid').append(img);
			}

			if(i<= robots[selectedrobot1][2]){
				var img = $("<img src='images/staticon_filled.png' />");
				$('#choosebody .player1 .sterkte').append(img);
			}else {
				var img = $("<img src='images/staticon.png' />");
				$('#choosebody .player1 .sterkte').append(img);
			}
		}
	}

	if(step === "chooseBodyP2") {
			switch(selectedrobot2) {
			case 0: $('#choosebody .player2 .selection').removeClass().addClass('selection0').addClass('selection');
				break;
			case 1: $('#choosebody .player2 .selection').removeClass().addClass('selection1').addClass('selection');
				break;
			case 2: $('#choosebody .player2 .selection').removeClass().addClass('selection2').addClass('selection');
				break;
		}

		$('#choosebody .player2 h1').html(robots[selectedrobot2][0]);
		$('#choosebody .player2 .snelheid').html('');
		$('#choosebody .player2 .sterkte').html('');
		for(var i= 1; i<=5; i++) {
			if(i<= robots[selectedrobot2][1]){
				var img = $("<img src='images/staticon_filled.png' />");
				$('#choosebody .player2 .snelheid').append(img);
			}else {
				var img = $("<img src='images/staticon.png' />");
				$('#choosebody .player2 .snelheid').append(img);
			}

			if(i<= robots[selectedrobot2][2]){
				var img = $("<img src='images/staticon_filled.png' />");
				$('#choosebody .player2 .sterkte').append(img);
			}else {
				var img = $("<img src='images/staticon.png' />");
				$('#choosebody .player2 .sterkte').append(img);
			}
		}
	}


	if(step === "chooseLongDistanceWeaponsP1") {
			switch(selectedLRweapon1) {
			case 0: $('#chooselongdistanceweapon .player1 .selection').removeClass().addClass('selection0').addClass('selection');
				break;
			case 1: $('#chooselongdistanceweapon .player1 .selection').removeClass().addClass('selection1').addClass('selection');
				break;
			case 2: $('#chooselongdistanceweapon .player1 .selection').removeClass().addClass('selection2').addClass('selection');
				break;
		}

		$('#chooselongdistanceweapon .player1 h1').html(longweapons[selectedLRweapon1][0]);
		$('#chooselongdistanceweapon .player1 .herlaadsnelheid').html('');
		$('#chooselongdistanceweapon .player1 .kracht').html('');
		for(var i= 1; i<=5; i++) {
			if(i<= longweapons[selectedLRweapon1][1]){
				var img = $("<img src='images/staticon_filled.png' />");
				$('#chooselongdistanceweapon .player1 .herlaadsnelheid').append(img);
			}else {
				var img = $("<img src='images/staticon.png' />");
				$('#chooselongdistanceweapon .player1 .herlaadsnelheid').append(img);
			}

			if(i<= longweapons[selectedLRweapon1][2]){
				var img = $("<img src='images/staticon_filled.png' />");
				$('#chooselongdistanceweapon .player1 .kracht').append(img);
			}else {
				var img = $("<img src='images/staticon.png' />");
				$('#chooselongdistanceweapon .player1 .kracht').append(img);
			}
		}
	}

	if(step === "chooseLongDistanceWeaponsP2") {
			switch(selectedLRweapon2) {
			case 0: $('#chooselongdistanceweapon .player2 .selection').removeClass().addClass('selection0').addClass('selection');
				break;
			case 1: $('#chooselongdistanceweapon .player2 .selection').removeClass().addClass('selection1').addClass('selection');
				break;
			case 2: $('#chooselongdistanceweapon .player2 .selection').removeClass().addClass('selection2').addClass('selection');
				break;
		}

		$('#chooselongdistanceweapon .player2 h1').html(longweapons[selectedLRweapon2][0]);
		$('#chooselongdistanceweapon .player2 .herlaadsnelheid').html('');
		$('#chooselongdistanceweapon .player2 .kracht').html('');
		for(var i= 1; i<=5; i++) {
			if(i<= longweapons[selectedLRweapon2][1]){
				var img = $("<img src='images/staticon_filled.png' />");
				$('#chooselongdistanceweapon .player2 .herlaadsnelheid').append(img);
			}else {
				var img = $("<img src='images/staticon.png' />");
				$('#chooselongdistanceweapon .player2 .herlaadsnelheid').append(img);
			}

			if(i<= longweapons[selectedLRweapon2][2]){
				var img = $("<img src='images/staticon_filled.png' />");
				$('#chooselongdistanceweapon .player2 .kracht').append(img);
			}else {
				var img = $("<img src='images/staticon.png' />");
				$('#chooselongdistanceweapon .player12.kracht').append(img);
			}
		}
	}
}

function chooseBody() {
	console.log('CHOOSE BODY: ', robots);
	$("#choices .indicatorstep1").show();
	$("#choices .indicatorstep2").css('display', 'none');

	$('.logo-groot').addClass('logo-scale');
	$('#splash').hide();
	$('#choosebody').show();
	$('#choices').show();
	$('.versus').show();

	if(step === "chooseBodyP1")
	{
		$('#choosebody .player1').css('opacity', 1);
		$('.player2').css('opacity', 0.1);
		$('.wait').removeClass().addClass('player2wait').addClass('wait');
		setSelection();
	}

	if(step === "chooseBodyP2")
	{
		$('#choosebody .player1').css('opacity', 0.1);
		$('.player2').css('opacity', 1);
		$('.wait').removeClass().addClass('player1wait').addClass('wait');
		setSelection();
	}
}

function chooseLongDistanceWeapons() {
	$("#choices .indicatorstep1").hide();
	$("#choices .indicatorstep2").css('display', 'block');
	$('#choosebody').hide();
	$('#chooselongdistanceweapon').show();

	if(step === "chooseLongDistanceWeaponsP1")
	{
		$('#chooselongdistanceweapon .player1').css('opacity', 1);
		$('#chooselongdistanceweapon .player2').css('opacity', 0.1);
		$('.wait').removeClass().addClass('player2wait').addClass('wait');
		setSelection();
	}

	if(step === "chooseLongDistanceWeaponsP2")
	{
		$('#chooselongdistanceweapon .player1').css('opacity', 0.1);
		$('#chooselongdistanceweapon .player2').css('opacity', 1);
		$('.wait').removeClass().addClass('player1wait').addClass('wait');
		setSelection();
	}

	initWebCam();
}

function initWebCam() {
	//$('#reader').css('display', 'block');

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	if(navigator.getUserMedia)
	{
		navigator.getUserMedia({video: true, audio: false}, showStream, errorHandler);
	}
}

function errorHandler(data) {
	console.log('nope');
	console.log(error);
}

function showStream(stream) {
	localStream = stream;
	videoEl[0].setAttribute('src', window.URL.createObjectURL(stream));
	startWatching();
}

function startWatching() {
	$('#reader').hide();
	qr.decodeFromVideo(document.querySelector("video"), function (err, result) {
  		(result != undefined) ? console.log(result) : console.log('kak');
  		//console.log(result, longweapons[1][0], selectedLRweapon1);
  		if(step == "chooseLongDistanceWeaponsP1"){
	  		if(result == longweapons[0][0])
	  		{
	  			selectedLRweapon1 = 0;
	  			setSelection();
	  		}

	  		if(result == longweapons[1][0])
	  		{
	  			selectedLRweapon1 = 1;
	  			setSelection();
	  		}

	  		if(result == longweapons[2][0])
	  		{
	  			selectedLRweapon1 = 2;
	  			setSelection();
	  		}
  		}

  		if(step == "chooseLongDistanceWeaponsP2") {
  			if(result == longweapons[0][0])
	  		{
	  			selectedLRweapon2 = 0;
	  			setSelection();
	  		}

	  		if(result == longweapons[1][0])
	  		{
	  			selectedLRweapon2 = 1;
	  			setSelection();
	  		}

	  		if(result == longweapons[2][0])
	  		{
	  			selectedLRweapon2 = 2;
	  			setSelection();
	  		}
  		}
  		
  	}, false);
}

function startGame() {
	document.getElementById('cnvs').addEventListener('game-ended', function(){
		selectedrobot1 = 0;
		selectedrobot2 = 0;
		selectedLRweapon1 = 0;
		selectedLRweapon2 = 0;
		step = "splash";
		$(".robot").css('display', 'none');
		$(".weapon").css('display', 'none');
		window.onkeydown = keyDownHandler;
		init();
	}, false);
	qr.stop();
	localStream.stop();
	$('#game').show();
	$(".logo-groot").hide();
	$('#choosebody').hide();
	$('#choices').hide();
	$('.versus').hide();
	$('#chooselongdistanceweapon').hide();
	new RobotWars($('#cnvs'),selectedrobot1, selectedrobot2, selectedLRweapon1, selectedLRweapon2);
	//new RobotWars($('#cnvs'));
}

init();

//new RobotWars($('#cnvs'));
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
},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/Bullet.js":[function(require,module,exports){
var Class = require('../core/Class.js');
var CollisionDetection = require('./CollisionDetection.js');
var Eventmanager = require('./Eventmanager.js');

module.exports = (function(){
	
	var Bullet = Class.extend({
		init: function(x, y, rotation, type, snelheid){
			this.collisionDetection = new CollisionDetection();
			this.event = new Eventmanager(this);
			this.x = x;
			this.y = y;
			this.rotation = rotation;
			this.speed = snelheid;
			this.displayobject = new createjs.Container();
			this.width = 5;
			this.height = 5;
			this.index = 0;

			this.displayobject.x = x;
			this.displayobject.y = y;
			this.displayobject.width = this.width;
			this.displayobject.height = this.height;

			var bullet = new createjs.Shape();

			if(type == "s-34")
			{
				bullet.graphics.beginFill("red").drawRect(0, 0, 5, 5);
			}

			if(type == "kg-43")
			{
				bullet.graphics.beginFill("#CC6600").drawRect(0, 0, 6, 2);
				bullet.rotation = rotation;
			}

			if(type == "kx-93")
			{
				bullet.graphics.beginFill("brown").drawRect(0, 0, 9, 2);
				bullet.rotation = rotation;
			}
			this.displayobject.addChild(bullet);
		},

		update: function(collisionboxes, otherPlayer) {


			for (var i= 0; i< collisionboxes.length; i++) {
				if(this.collisionDetection.checkCollision(this, collisionboxes[i])){
					this.event.fire("boundsHit");
				}
			}

			if(this.collisionDetection.checkCollision(this, otherPlayer)){
				this.event.fire("otherPlayerHit");
			}

			var directionVector = [];
			var accelerationVector = [];
			directionVector["x"] = Math.cos(this.rotation * Math.PI/180);
			directionVector["y"] = Math.sin(this.rotation * Math.PI/180);

			accelerationVector["x"] = directionVector["x"] * this.speed;
			accelerationVector["y"] = directionVector["y"] * this.speed;

			this.x = this.displayobject.x += accelerationVector["x"];
			this.y = this.displayobject.y += accelerationVector["y"];
		},
	});

	return Bullet;
})();
},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js","./CollisionDetection.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/CollisionDetection.js","./Eventmanager.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Eventmanager.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/CollisionDetection.js":[function(require,module,exports){
var Class = require('../core/Class.js');

module.exports = (function(){

	var CollisionDetection = Class.extend({
		init: function() {

		},

		checkCollision: function(shapeA, shapeB) {
			var vX = (shapeA.x + (shapeA.width/2)) - (shapeB.x + (shapeB.width/2));
			var vY = (shapeA.y + (shapeA.height/2)) - (shapeB.y + (shapeB.height/2));
			var hWidths = (shapeA.width/2) + (shapeB.width/2);
			var hHeights = (shapeA.height/2) + (shapeB.height/2);

			if(Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
				var oX = hWidths - Math.abs(vX);
				var oY = hHeights - Math.abs(vY);

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

		checkPlayerCollision: function(shapeA, shapeB) {
			var vX = (shapeA.x + (shapeA.width/2)) - (shapeB.x + (shapeB.width/2));
			var vY = (shapeA.y + (shapeA.height/2)) - (shapeB.y + (shapeB.height/2));
			var hWidths = (shapeA.width/2) + (shapeB.width/2);
			var hHeights = (shapeA.height/2) + (shapeB.height/2);

			if(Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
				var oX = hWidths - Math.abs(vX);
				var oY = hHeights - Math.abs(vY);

				//console.log('ShapeA: ', shapeA, 'ShapeB: ', shapeB);

				if(oX >= oY )
				{ 
					if(vY > 0) {
						shapeA.y += oY;
						shapeB.y -= oY;

					}else {
						shapeA.y -= oY;
						shapeB.y += oY;
					}
					return true;

				}else {

					if(vX > 0) {
						shapeA.x += oX;
						shapeB.x -= oX;

					}else {
						shapeA.x -= oX;
						shapeB.x += oX;
					}
					return true;
				}
			}

			return false;
		},
	});

	return CollisionDetection;

})();
},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/EventManager.js":[function(require,module,exports){
var Class = require('../core/Class.js');

module.exports = (function(){

	var Eventmanager = Class.extend({

		init: function(target){
			this.target = target || window;
        	this.events = {};
		}, 

		observe: function(eventName, cb) {
			if (this.events[eventName]) {
				this.events[eventName].push(cb);
			}else {
				this.events[eventName] = new Array(cb);
			}
        	return this.target;
		},

		stopObserving: function(eventName, cb) {
			if (this.events[eventName]) {
            	var i = this.events[eventName].indexOf(cb);
            	if (i > -1) {
            		this.events[eventName].splice(i, 1);
            	}else {return false;}
            	return true;
        	}else {return false;}
		},

		fire: function(eventName) {
			if (!this.events[eventName]) {return false;}
        	for (var i = 0; i < this.events[eventName].length; i++) {
            	this.events[eventName][i].apply(this.target, Array.prototype.slice.call(arguments, 1));
        	}
        },
	});

	return Eventmanager;

})();
},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/Eventmanager.js":[function(require,module,exports){
module.exports=require("/Applications/MAMP/htdocs/EXD/game/classes/browser/EventManager.js")
},{"/Applications/MAMP/htdocs/EXD/game/classes/browser/EventManager.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/EventManager.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/Healthbar.js":[function(require,module,exports){
/*globals createjs:true*/
var Class = require('../core/Class.js');

module.exports = (function(){

	var Healthbar = Class.extend({
		init: function(x, y, plaatsing, text, health) {
			this.x = x;
			this.y = y;
			this.health = health;
			this.plaatsing = plaatsing;
			this.text = new createjs.Text(text, "18px Press Start K", "white");

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
},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/Player.js":[function(require,module,exports){
/*globals createjs:true*/
var Class = require('../core/Class.js');
var Bullet = require('./Bullet.js');
var Eventmanager = require('./EventManager.js');

module.exports = (function(){

	var Player = Class.extend({
		init: function(x, y, friction, type, speed, strength) {
			this.event = new Eventmanager(this);
			this.x = x;
			this.y = y;
			this.friction = friction;
			this.speed = 0;
			this.maxspeed = speed;
			this.rotation = 0;
			this.velX = 0;
			this.velY = 0;
			this.bullets = [];
			this.health = 20 * strength;
			this.shieldUsed = false;
			this.shield = false;

			this.spritesheeturl = "../images/sprites/";

			this.displayobject = new createjs.Container();

			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.spritesheeturl += type + ".png";
			
			if(type === "spud") {
				this.framewidth = 85;
			}else{
				this.framewidth = 83;
			}

			console.log('TYPE ROBOT: ', this.spritesheeturl);
			this.loadGraphics();

		},

		loadGraphics: function() {
			//spritesheet van de speler inladen
			var rect = new createjs.Shape();
			rect.graphics.beginFill("orange").drawRect(0, 0, 80, 80);

			this.displayobject.regX = 0;
			this.displayobject.regY = 0;

			var spritesheet = new createjs.SpriteSheet({
				"images":[this.spritesheeturl],
				"frames": {"width": this.framewidth, "height": 81, "count":5, "regX": 41.5, "regY": 40.5},
				"animations": {
					drive: {
						frames:[2, 3, 4, 2],
						speed: 0.1
					},
					hit: {
						frames: [0,1],
						next: "drive",
						speed: 0.1
					}
				}
			});

			this.playerSprite = new createjs.Sprite(spritesheet, "drive");
			this.playerSprite.x = 40;
			this.playerSprite.y = 40;
			this.displayobject.addChild(this.playerSprite);
			this.displayobject.width = this.width = 80;
			this.displayobject.height = this.height = 80;

		},

		update: function() {

			this.displayobject.x = this.x;
			this.displayobject.y = this.y;

			this.speed *= this.friction;

			if(this.rotation <= 0 && this.rotation >= -2)
			{
				this.rotation = 360;
			}else if(this.rotation > 360 && this.rotation <= 362){
				this.rotation = 0;
			}

			var directionVector = [];
			var accelerationVector = [];
			directionVector["x"] = Math.cos(this.rotation * Math.PI/180);
			directionVector["y"] = Math.sin(this.rotation * Math.PI/180);

			accelerationVector["x"] = directionVector["x"] * this.speed;
			accelerationVector["y"] = directionVector["y"] * this.speed;

			this.playerSprite.rotation = this.rotation;

			this.displayobject.x += accelerationVector["x"];
			this.displayobject.y += accelerationVector["y"];

			this.x = this.displayobject.x;
			this.y = this.displayobject.y;
		},

		attack: function(type, snelheid, kracht) {
				this.bulletdamage = kracht;
				var bullet = new Bullet(this.x + 40, this.y + 40, this.rotation, type, snelheid, kracht);
				var world = this.displayobject.parent;
				bullet.index = (this.bullets.length > 0) ? this.bullets.length : 0;
				this.bullets.push(bullet);

				var callback = (function(){
					this.bulletHitBound(bullet);
				}).bind(this);

				var callback2 = (function(){
					this.otherPlayerHit(bullet);
				}).bind(this);

				bullet.boundHitCallback = callback;
				bullet.playerHitCallback = callback2;
				bullet.event.observe('boundsHit', callback);
				bullet.event.observe('otherPlayerHit', callback2);

				world.addChildAt(bullet.displayobject, world.getChildIndex(this.displayobject));
		},

		bulletHitBound: function(bullet) {
			this.bullets[this.bullets.indexOf(bullet)].event.stopObserving('otherPlayerHit', this.bullets[this.bullets.indexOf(bullet)].otherPlayerHitCallback);
			this.bullets[this.bullets.indexOf(bullet)].event.stopObserving('boundsHit', this.bullets[this.bullets.indexOf(bullet)].boundHitCallback);
			var world = this.displayobject.parent;
			world.removeChild(this.bullets[this.bullets.indexOf(bullet)].displayobject);
			this.bullets.splice(this.bullets.indexOf(bullet), 1);
		},

		otherPlayerHit: function(bullet) {
			this.bullets[this.bullets.indexOf(bullet)].event.stopObserving('otherPlayerHit', this.bullets[this.bullets.indexOf(bullet)].otherPlayerHitCallback);
			this.bullets[this.bullets.indexOf(bullet)].event.stopObserving('boundsHit', this.bullets[this.bullets.indexOf(bullet)].boundHitCallback);

			var world = this.displayobject.parent;
			world.removeChild(this.bullets[this.bullets.indexOf(bullet)].displayobject);
			this.bullets.splice(this.bullets.indexOf(bullet), 1);

			this.event.fire('playerHit');
		},

		useShield: function() {
			if(!(this.shieldUsed))
			{
				this.shieldUsed = true;
				this.shield = true;
				this.shieldbitmap = new createjs.Bitmap("../images/sprites/shield.png");
				this.shieldbitmap.regX = 110;
				this.shieldbitmap.regY = 110;
				this.shieldbitmap.x =  41.5;
				this.shieldbitmap.y = 40.5;
				this.displayobject.addChild(this.shieldbitmap);
				setTimeout((function(){
					this.shield=false;
					this.displayobject.removeChild(this.shieldbitmap);
				}).bind(this), 10000);
			}
		},
	});

	return Player;

})();
},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js","./Bullet.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Bullet.js","./EventManager.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/EventManager.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/RobotWars.js":[function(require,module,exports){
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

},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js","./Bound.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Bound.js","./Bullet.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Bullet.js","./CollisionDetection.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/CollisionDetection.js","./Healthbar.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Healthbar.js","./Player.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Player.js","./TileMap.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/TileMap.js","./TimeIndicator.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/TimeIndicator.js","./World.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/World.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/Tile.js":[function(require,module,exports){
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

},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/TileMap.js":[function(require,module,exports){
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

},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js","./Eventmanager.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Eventmanager.js","./Tile.js":"/Applications/MAMP/htdocs/EXD/game/classes/browser/Tile.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/TimeIndicator.js":[function(require,module,exports){
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
},{"../core/Class.js":"/Applications/MAMP/htdocs/EXD/game/classes/core/Class.js"}],"/Applications/MAMP/htdocs/EXD/game/classes/browser/World.js":[function(require,module,exports){
/*globals createjs:true*/
var Class = require('../core/Class.js');

module.exports = (function(){

	var World = Class.extend({
		init: function(width, height) {
			this.boundH = "";
			this.boundW = "";

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
