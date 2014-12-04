/* globals process:true */

var express = require("express");
var app = express();

app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function() {
  console.log('Server listening at port 3000');
});


var five = require('johnny-five');
var board = new five.Board();


board.on('ready', function(){
	console.log('board is ready');

	joystickDown = new five.Button(2);
	joystickUp = new five.Button(5);
	joystickRight = new five.Button(3);
	joystickLeft = new five.Button(4);

	board.repl.inject({
		button: joystickDown,
		button: joystickUp,
		button: joystickRight,
		button: joystickLeft
	})	

	joystickDown.on("up", function(){
		console.log('down ingedrukt');
	});

	joystickDown.on("down", function(){
		console.log('down losgelaten');
	});

	joystickUp.on("up", function(){
		console.log('up ingedrukt');
	});

	joystickUp.on("down", function(){
		console.log('up losgelaten');
	});

	joystickRight.on("up", function(){
		console.log('right ingedrukt');
	});

	joystickRight.on("down", function(){
		console.log('right losgelaten');
	});

	joystickLeft.on("up", function(){
		console.log('left ingedrukt');
	});

	joystickLeft.on("down", function(){
		console.log('left losgelaten');
	});

});




app.get('/led/:pin/:state', function(req, res){
	console.log(req.params.pin);
	console.log(req.params.state);
});


