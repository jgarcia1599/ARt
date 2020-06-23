// create express web server
var express = require('express'); 
var app = express();
//choose port
var port = 3000;
var server = app.listen(process.env.PORT || port);
// use static files to serve to client that reside on public folder
app.use(express.static('public'));

console.log('Server Running in Port: ',port);
// initial socket.io and wrap server on io instance
var socket = require('socket.io');
var io = socket(server);


io.sockets.on('connection', socket =>{
	console.log('new connection: ' + socket.id);
	//join room event handler that joins user to its respective room
	socket.on("join_room", room=>{
		console.log(room);
		socket.join(room);
	});
	//drawing event handler that receives drawing from one client and emits it to all other clients
	// in the same room
	socket.on('drawing', received =>{
		console.log(received.data);
		socket.to(received.room).emit('drawing', received.data);
	});

});



