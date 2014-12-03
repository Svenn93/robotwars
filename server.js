/* globals process:true */

var express = require("express");
var app = express();

app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function() {
  console.log('Server listening at port 3000');
});


/*var five = require('johnny-five');
var board, led;

board = new five.Board();

board.on('ready', function(){
	led = new five.Led(13);
	led2 = new five.Led(12);
	led.off();
	led2.off();
});*/


/*app.get('/led/:pin/:state', function(req, res){
	console.log(req.params.pin);
	console.log(req.params.state);
});*/


