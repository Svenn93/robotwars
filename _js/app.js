var RobotWars = require('../classes/browser/RobotWars.js');
var step="splash";
var socket = "";
var socketid = "";
var joystick = {};
var selectedrobot1 = 0;
var selectedrobot2 = 0;
var selectedLRweapon1 = 0;

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
	initSocket();
	$('#game').hide();
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

	socket.on('userinput', function(data){
		for (var key in data){
			joyStick1[key] = data[key];
		}
	});
}

function keyDownHandler(event) {
	switch(event.keyCode)
	{
		case 32:
				spacePressed();
			break;
		case 37: 
				leftPressed();
			break;
		case 39:
				rightPressed();
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
			step = "chooseBodyP2"; 
			$("#choices .player1 ." + robots[selectedrobot1][0]).css('display', 'block');
			setTimeout(function(){
				chooseBody();
			}, 2000);
		break;
		case "chooseBodyP2":
			step = "chooseLongDistanceWeaponsP1"; 
			$("#choices .player2 ." + robots[selectedrobot2][0]).css('display', 'block');
			setTimeout(function(){
				chooseLongDistanceWeapons();
			}, 2000);
		break;
		case "chooseLongDistanceWeaponsP1":
			step = "chooseLongDistanceWeaponsP2";
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
		if(selectedLRweapon1 > 0)
		{
			selectedLRweapon1 -=1;
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
		if(selectedLRweapon1 < 3)
		{
			selectedLRweapon1 +=1;
			setSelection();
		}
	}
}

function setSelection() {
	/******BEGIN VAN DE BODY*******/
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

	/*******END VAN DE BODIES **********/

	/*******BEGIN LONG DISTANCE WEAPON ********/
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
}

function chooseBody() {
	console.log('CHOOSE BODY: ', robots);
	$('.logo-groot').addClass('logo-scale');
	$('#splash').hide();
	$('#choosebody').show();
	$('#choices').show();
	$('.versus').show();

	if(step === "chooseBodyP1")
	{
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
		$('#chooselongdistanceweapon .player2').css('opacity', 0.1);
		$('.wait').removeClass().addClass('player2wait').addClass('wait');
		setSelection();
	}
}

init();

//new RobotWars($('#cnvs'));