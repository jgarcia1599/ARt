var socket, myColor, mySize;

//Posenet stuff

var poseNet;
var poses = [];
var video;

function setup(){
	createCanvas(600,400);
	video = createCapture(VIDEO);
	video.size(640, 480);
	// video.hide();
	background(51)
	socket = io()
	socket.on('mouse', newDrawing)
	myColor = [random(255), random(255), random(255)]
	mySize = random(10,70)
}



function newDrawing(data){
	noStroke();
	fill(data.color[0],data.color[1],data.color[2]);
	ellipse(data.x, data.y, data.size, data.size)
}

function mouseDragged(){
	var data = {
		x: mouseX,
		y: mouseY,
		color: myColor,
		size: mySize
	}
  console.log(data);
	socket.emit('mouse', data)

	noStroke();
	fill(myColor[0], myColor[1], myColor[2]);
	ellipse(mouseX, mouseY, mySize, mySize)
}


//https://www.youtube.com/watch?v=2hhEOGXcCvg