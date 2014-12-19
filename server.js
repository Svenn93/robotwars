/* globals __dirname:true */
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var five = require('johnny-five');
//var board1 = new five.Board({port: "/dev/cu.usbmodemfd1221"});
//var board2 = new five.Board({port: "/dev/cu.usbmodemfd1231"});
//var board = new five.Board();

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	console.log('socketid: ', socket.id);

	socket.emit('socketid', socket.id);
	board1.on('ready', function(){
		console.log('board1 is ready');

		var joystickDown = new five.Button({pin:2, board:board1});
		var joystickUp = new five.Button({pin:5, board:board1});
		var joystickRight = new five.Button({pin:3, board:board1});
		var joystickLeft = new five.Button({pin:4, board:board1});
		var fireButton = new five.Button({pin:6, board:board1});
		var fireButtonShort = new five.Button({pin:7, board:board1});
		var shieldButton = new five.Button({pin:8, board:board1});

		var input1 = {};

		board1.repl.inject({
			button1: joystickDown,
			button2: joystickUp,
			button3: joystickRight,
			button4: joystickLeft,
			button5: fireButton,
			button6: fireButtonShort,
			button7: shieldButton
		});	

		joystickDown.on("up", function(){
			console.log('down player 1');
			input1["down"] = 1;
			socket.emit('userinput1', input1);

		});

		joystickDown.on("down", function(){
			input1["down"] = 0;
			socket.emit('userinput1', input1);
		});

		joystickUp.on("up", function(){
			input1["up"] = 1;
			console.log('up');
			socket.emit('userinput1', input1);
		});

		joystickUp.on("down", function(){
			input1["up"] = 0;
			socket.emit('userinput1', input1);
		});

		joystickRight.on("up", function(){
			input1["right"] = 1;
			console.log('right');
			socket.emit('userinput1', input1);
		});

		joystickRight.on("down", function(){
			input1["right"] = 0;
			socket.emit('userinput1', input1);
		});

		joystickLeft.on("up", function(){
			input1["left"] = 1;
			console.log('left');
			socket.emit('userinput1', input1);
		});

		joystickLeft.on("down", function(){
			input1["left"] = 0;
			socket.emit('userinput1', input1);
		});

		fireButton.on("down", function(){
			console.log('fire');
			input1["longrange"] = 0;
			socket.emit('userinput1', input1);
		});

		fireButton.on("up", function(){
			input1["longrange"] = 1;
			socket.emit('userinput1', input1);
		});

		fireButtonShort.on("down", function(){
			console.log('fire short');
			input1["shortrange"] = 0;
			socket.emit('userinput1', input1);
		});

		fireButtonShort.on("up", function(){
			input1["shortrange"] = 1;
			socket.emit('userinput1', input1);
		});

		shieldButton.on("down", function(){
			console.log('shield');
			input1["shield"] = 0;
			socket.emit('userinput1', input1);
		});

		shieldButton.on("up", function(){
			input1["shield"] = 1;
			socket.emit('userinput1', input1);
		});
	});

	board2.on('ready', function(){
		console.log('board2 is ready');

		var joystickDown2 = new five.Button({pin:2, board:board2});
		var joystickUp2 = new five.Button({pin:5, board:board2});
		var joystickRight2 = new five.Button({pin:3, board:board2});
		var joystickLeft2 = new five.Button({pin:4, board:board2});
		var fireButton2 = new five.Button({pin:6, board:board2});
		var fireButtonShort2 = new five.Button({pin:7, board:board2});
		var shieldButton2 = new five.Button({pin:8, board:board2});

		var input2 = {};

		board2.repl.inject({
			button1: joystickDown2,
			button2: joystickUp2,
			button3: joystickRight2,
			button4: joystickLeft2,
			button5: fireButton2,
			button6: fireButtonShort2,
			button7: shieldButton2
		});

		joystickDown2.on("up", function(){
			console.log('down');
			input2["down"] = 1;
			socket.emit('userinput2', input2);
		});

		joystickDown2.on("down", function(){
			input2["down"] = 0;
			socket.emit('userinput2', input2);
		});

		joystickUp2.on("up", function(){
			input2["up"] = 1;
			console.log('up');
			socket.emit('userinput2', input2);
		});

		joystickUp2.on("down", function(){
			input2["up"] = 0;
			socket.emit('userinput2', input2);
		});

		joystickRight2.on("up", function(){
			input2["right"] = 1;
			console.log('right');
			socket.emit('userinput2', input2);
		});

		joystickRight2.on("down", function(){
			input2["right"] = 0;
			socket.emit('userinput2', input2);
		});

		joystickLeft2.on("up", function(){
			input2["left"] = 1;
			console.log('left');
			socket.emit('userinput2', input2);
		});

		joystickLeft2.on("down", function(){
			input2["left"] = 0;
			socket.emit('userinput2', input2);
		});

		fireButton2.on("down", function(){
			console.log('fire');
			input2["longrange"] = 0;
			socket.emit('userinput2', input2);
		});

		fireButton2.on("up", function(){
			input2["longrange"] = 1;
			socket.emit('userinput2', input2);
		});

		fireButtonShort2.on("down", function(){
			console.log('fire short');
			input2["shortrange"] = 0;
			socket.emit('userinput2', input2);
		});

		fireButtonShort2.on("up", function(){
			input2["shortrange"] = 1;
			socket.emit('userinput2', input2);
		});

		shieldButton2.on("down", function(){
			console.log('shield');
			input2["shield"] = 0;
			socket.emit('userinput2', input2);
		});

		shieldButton2.on("up", function(){
			input2["shield"] = 1;
			socket.emit('userinput2', input2);
		});
	});
});

server.listen(3000, function() {
  console.log('Server listening at port 3000');
});




