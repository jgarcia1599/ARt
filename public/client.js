//Userbrush variable to determine what brush the user chose.
var user_brush = "mouse";

//Jquery function that obtain's the user's choice froom the DOM
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



//Global variables used throughout program
//soocket =  for web socket communicaton
// myColor = randomly chosen color for client
// mySize = randomly chosen stroke size for client
var socket, myColor, mySize;

//Posenet stuff
let poseNet;
let poses = [];
let video;
let pg;

function setup(){
	//Create canvas
	var canvas = createCanvas(700, 500);
	//Place cavas inside desired DOM element
	canvas.parent('jumbo-canvas');
	//Create video feed
	video = createCapture(VIDEO);
	//Set video feed as the same size of the canvas
	video.size(width, height);
	// Hide the video element, and just show the canvas
	video.hide();

	//graphics element on top of video feed
	pixelDensity(1);
	pg = createGraphics(width, height);
  
  
	// Create a new poseNet method with a single detection
	poseNet = ml5.poseNet(video, modelReady);
	// This sets up an event that fills the global variable "poses"
	// with an array every time new poses are detected
	poseNet.on('pose', function(results) {
	  poses = results;
	});

	// initialize socket
	socket = io()
	// listen for any new incoming drawings from server and draw them,
	socket.on('drawing', data=>{
		pg.noStroke();
		pg.fill(data.color[0],data.color[1],data.color[2]);
		pg.ellipse(data.x, data.y, data.size, data.size)
	});

	//Randomly choose size and color
	myColor = [random(255), random(255), random(255)]
	mySize = random(10,70)

	//Join sketchroom
	socket.emit('join_room',room);

	//add sketchroom name to UI
	$('#room').append(room);
	$('#room').css({
		'color':`rgb(${myColor[0]},${myColor[1]},${myColor[2]})`
	});

}
//callback fucnction that runs when the Posenet\s model is ready to use
function modelReady() {
	console.log("Model Ready");
}

function draw() {
	//draw video feed
	image(video,0,0,width,height);
	//draw graphics element aka the drawing
	image(pg, 0, 0, width, height);

  
	// // We can call both functions to draw all keypoints and the skeletons
	drawKeypoints();

  }

//function that deals with moouse drawing
function mouseDragged(){
	if (user_brush =="mouse"){
		//create data element to send to server
		var data = {
			x: mouseX,
			y: mouseY,
			color: myColor,
			size: mySize
		}
		//emeit data element to the server
		socket.emit('drawing', {data,room});
		//draw on the pg element the ellipse
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
		// Only draw an ellipse is the pose probability is bigger than 0.2 and if the user has chosen the pose
		if (keypoint.score > 0.2 && keypoint.part == user_brush) {
		//draw on the pg element the ellipse
		  pg.fill(myColor[0], myColor[1], myColor[2]);
		  pg.noStroke();
		  pg.ellipse(keypoint.position.x, keypoint.position.y, mySize, mySize);
		  //create data element to send to server
		  var data = {
			x: keypoint.position.x,
			y: keypoint.position.y,
			color: myColor,
			size: mySize
			};
		   //draw on the pg element the ellipse
		   socket.emit('drawing', {data,room});
		}
		else if(keypoint.score > 0.2 && user_brush == "all"){
			//draw on the pg element the ellipse
			pg.fill(random(255), random(255), random(255));
			pg.noStroke();
			pg.ellipse(keypoint.position.x, keypoint.position.y, mySize, mySize);
			//create data element to send to server
			var data = {
			x: keypoint.position.x,
			y: keypoint.position.y,
			color: myColor,
			size: mySize
			};
			//draw on the pg element the ellipse
			socket.emit('drawing', {data,room});
		}
	  }
	}
  }
  
  // A function to draw the skeletons
  // This is a posenet helper function that aids with development. Dont delete!
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

//helper function that lets users copy the url to their clipboard
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