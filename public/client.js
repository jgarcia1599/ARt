var socket, myColor, mySize;

//Posenet stuff

let poseNet;
let poses = [];
let video;

function setup(){
	var canvas = createCanvas(640, 480);
	canvas.parent('jumbo-canvas')
	// video = createCapture(VIDEO);
	// video.size(width/2, height/2);
	// video.parent('jumbo-canvas');
	// // Hide the video element, and just show the canvas
	// video.hide();
  
	// // Create a new poseNet method with a single detection
	// poseNet = ml5.poseNet(video, modelReady);
	// // This sets up an event that fills the global variable "poses"
	// // with an array every time new poses are detected
	// poseNet.on('pose', function(results) {
	//   poses = results;
	// });




	background(51)
	socket = io()
	socket.on('mouse', newDrawing)
	myColor = [random(255), random(255), random(255)]
	mySize = random(10,70)
}
function modelReady() {
	console.log("Model Ready");
}

function draw() {
	// background(51);
  
	// // We can call both functions to draw all keypoints and the skeletons
	// drawKeypoints();
	// drawSkeleton();
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
		if (keypoint.score > 0.2) {
		  fill(255, 0, 0);
		  noStroke();
		  ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
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




//https://www.youtube.com/watch?v=2hhEOGXcCvg