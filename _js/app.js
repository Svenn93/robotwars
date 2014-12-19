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