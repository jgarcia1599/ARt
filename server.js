var express = require('express'); 
var app = express();
var Qs = require('qs');
var port = 3000;
var server = app.listen(process.env.PORT || port);
app.use(express.static('public'));
console.log('Server Running in Port: ',port)
var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log('new connection: ' + socket.id)
	
	socket.on('drawing', mouseMsg);
	function mouseMsg(received){
		console.log(received.data);
		socket.to(received.room).emit('drawing', received.data);
	}

	socket.on("join_room", room=>{
		console.log(room);
		socket.join(room);
	})
}
