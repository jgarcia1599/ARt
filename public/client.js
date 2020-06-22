var user_brush = "mouse";
$(document).ready(function(){
$("input[type='radio']").click(function(){
	var radioValue = $("input[name='brush_choice']:checked").val();
	if(radioValue){
		user_brush = radioValue;
		console.log("Your are a - " + user_brush);
		
	}
});
});

// Get username and room from URL
const {room} = Qs.parse(location.search, {
	ignoreQueryPrefix: true
  });
console.log(room);




var socket, myColor, mySize;

//Posenet stuff

let poseNet;
let poses = [];
let video;
let pg;

function setup(){
	var canvas = createCanvas(700, 500);
	canvas.parent('jumbo-canvas')
	video = createCapture(VIDEO);
	video.size(width, height);
	video.parent('jumbo-canvas');
	// Hide the video element, and just show the canvas
	video.hide();

	//graphics on top of video feed
	pixelDensity(1);
	pg = createGraphics(width, height);
  
  
	// // Create a new poseNet method with a single detection
	poseNet = ml5.poseNet(video, modelReady);
	// This sets up an event that fills the global variable "poses"
	// with an array every time new poses are detected
	poseNet.on('pose', function(results) {
	  poses = results;
	});




	background(51)
	socket = io()
	socket.on('drawing', newDrawing)
	myColor = [random(255), random(255), random(255)]
	mySize = random(10,70)

	//Join chatroom
	socket.emit('join_room',room);
}
console.log(socket);

function modelReady() {
	console.log("Model Ready");
}

function draw() {
	image(video,0,0,width,height);

	image(pg, 0, 0, width, height);

	// background(51);
  
	// // We can call both functions to draw all keypoints and the skeletons
	drawKeypoints();
	// drawSkeleton();
  }



function newDrawing(data){
	pg.noStroke();
	pg.fill(data.color[0],data.color[1],data.color[2]);
	pg.ellipse(data.x, data.y, data.size, data.size)
}

function mouseDragged(){
	if (user_brush =="mouse"){
		var data = {
			x: mouseX,
			y: mouseY,
			color: myColor,
			size: mySize
		}
		  console.log(data);
		socket.emit('drawing', {data,room});
	
		pg.noStroke();
		pg.fill(myColor[0], myColor[1], myColor[2]);
		pg.ellipse(mouseX, mouseY, mySize, mySize);

	}



}
// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
	// Loop through all the poses detected
	for (let i = 0; i < poses.length; i++) {
	  // For each pose detected, loop through all the keypoints
	  let pose = poses[i].pose;
	  for (let j = 0; j < pose.keypoints.length; j++) {
		// A keypoint is an object describing a body part (like rightArm or leftShoulder)
		let keypoint = pose.keypoints[j];
		// Only draw an ellipse is the pose probability is bigger than 0.2
		if (keypoint.score > 0.2 && keypoint.part == user_brush) {
		  pg.fill(myColor[0], myColor[1], myColor[2]);
		  pg.noStroke();
		  pg.ellipse(keypoint.position.x, keypoint.position.y, mySize, mySize);
		  var data = {
			x: keypoint.position.x,
			y: keypoint.position.y,
			color: myColor,
			size: mySize
			};
			socket.emit('drawing', {data,room});


		}
	  }
	}
  }
  
  // A function to draw the skeletons
  function drawSkeleton() {
	// Loop through all the skeletons detected
	for (let i = 0; i < poses.length; i++) {
	  let skeleton = poses[i].skeleton;
	  // For every skeleton, loop through all body connections
	  for (let j = 0; j < skeleton.length; j++) {
		let partA = skeleton[j][0];
		let partB = skeleton[j][1];
		stroke(255, 0, 0);
		line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
	  }
	}
  }

//function to download the canvas once a user is done.
function downloadcanvas(){
	console.log("ok lets download");
	save(pg, "art", 'png');

}

function shareurl(){
	console.log("URL in clipboard");
	var dummy = document.createElement('input'),
	text = window.location.href;
	document.body.appendChild(dummy);
	dummy.value = text;
	dummy.select();
	document.execCommand('copy');
	document.body.removeChild(dummy);
	alert('Link copied to clipboard. Please share with your friends! :)');
}




//https://www.youtube.com/watch?v=2hhEOGXcCvg