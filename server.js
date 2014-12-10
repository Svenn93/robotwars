/* globals __dirname:true */
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var five = require('johnny-five');
var board = new five.Board();

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	console.log('socketid: ', socket.id);

	socket.emit('socketid', socket.id);

	board.on('ready', function(){
		console.log('board is ready');

		var joystickDown = new five.Button(2);
		var joystickUp = new five.Button(5);
		var joystickRight = new five.Button(3);
		var joystickLeft = new five.Button(4);

		var input = {};

		board.repl.inject({
			button1: joystickDown,
			button2: joystickUp,
			button3: joystickRight,
			button4: joystickLeft
		});	

		joystickDown.on("up", function(){
			console.log('down ingedrukt');
			input["down"] = 1;
			socket.emit('userinput', input);

		});

		joystickDown.on("down", function(){
			input["down"] = 0;
			console.log('down losgelaten');
			socket.emit('userinput', input);
		});

		joystickUp.on("up", function(){
			input["up"] = 1;
			console.log('up ingedrukt');
			socket.emit('userinput', input);
		});

		joystickUp.on("down", function(){
			input["up"] = 0;
			console.log('up losgelaten');
			socket.emit('userinput', input);
		});

		joystickRight.on("up", function(){
			input["right"] = 1;
			console.log('right ingedrukt');
			socket.emit('userinput', input);
		});

		joystickRight.on("down", function(){
			input["right"] = 0;
			console.log('right losgelaten');
			socket.emit('userinput', input);
		});

		joystickLeft.on("up", function(){
			input["left"] = 1;
			console.log('left ingedrukt');
			socket.emit('userinput', input);
		});

		joystickLeft.on("down", function(){
			input["left"] = 0;
			console.log('left losgelaten');
			socket.emit('userinput', input);
		});
	});
});

server.listen(3000, function() {
  console.log('Server listening at port 3000');
});




