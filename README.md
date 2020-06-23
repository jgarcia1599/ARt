# AR[t]
An Augmented Reality tool for artistic collaboration. 

# Documentation

## Description
For my Intro to IM final project, I wanted to delve into something I have been afraid of delving into in the past: server-side programming with Node.js. After talking with my professor, he agreed to let me take on this challenge instead of connecting Arduino and Processing ( which I proved to myself I can do in this previous <a href="https://github.com/jgarcia1599/IntrotoIM_Summer2020/tree/master/hw_June21">assignment</a>). Similar to how we were supposed to use serial communication to communicate between an Arduino microcontroller and a Processing sketch, I decided to use web sockets to communicate between a Node.js server and the clients connected to said server. As a result, I created ARt, a tool that lets artists and art enthusiasts create simple art pieces over the Internet. Inspired by a remote-first era, I envisioned a future wheree everything can take place online, even art! To spice it up a notch, I decided to let the users of the app use their body for artistic self expression by using body pose tracking using Posenet.  

## Process and Implementation

## Future Improvements

# To use online
- Go to this url: https://collart.herokuapp.com/
- Create a room on the landing page. 
- Share URL with your friends and start painting!

# Dependencies
- <a href="https://ml5js.org/reference/api-PoseNet/">ml5's Posenet</a> : For pose estimation using your webcam.
- <a href="https://p5js.org/">p5.js</a> : For sketch drawing.
- <a href="https://jquery.com/">Jquery</a> : For DOM manipulation.
- <a href="https://nodejs.org/en/">Node.js</a>: For server-sid programming.
    - <a href="https://socket.io/">socket.io</a>: For web socket communication between the clients and the server.
    - <a href="https://expressjs.com/">Express</a>: For easier web server creation. 

# To install and use locally
- Clone this repository.
```
git clone https://github.com/jgarcia1599/ARt.git
```
- enter directory
```
cd ARt
```
- Install node dependencies
```
npm install
```
- Start server
```
npm start
```

- Go to localhost:3000 in your browser and start painting !

# Development Practices
If you wish to expand on this project, fork this repository. I used the <a href="https://www.npmjs.com/package/nodemon">nodemon</a> module as it hot-refreshes my server every time I update it. I recommend you to do the same. 
- To use nodemon
```
nodemon server.js
```

# Resources 
- Traversy Media tutorial for web sockets: https://www.youtube.com/watch?v=jD7FnbI76Hg
- Daniel Shiffman tutorial for https://www.youtube.com/watch?v=2hhEOGXcCvg

