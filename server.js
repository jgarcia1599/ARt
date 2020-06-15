var express = require('express'); 
var app = express();
var port = 3000;
var server = app.listen(process.env.PORT || port);
app.use(express.static('public'));
console.log('Server Running in Port: ',port)
var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log('new connection: ' + socket.id)
	
	socket.on('mouse', mouseMsg);
	function mouseMsg(data){
		socket.broadcast.emit('mouse', data);
		//the line below will send to everyone including the client
		// io.sockets.emit('mouse', data);
		console.log(data)
	}
}
