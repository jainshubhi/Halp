"use strict";
console.log('streamdestination DEBUG');
var socket;
    socket = new WebSocket("ws://" + window.location.host, "echo-protocol");
    socket.addEventListener("open", function(event) {
    });

    // Display messages received from the server
    socket.addEventListener("message", function(event) {
      console.log('socket.addEventListener - message');
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      var img = new Image;
      img.onload = function(){
        ctx.drawImage(img,0,0); // Or at whatever offset you like
      };
      img.src = event.data;

      //message.textContent = "Server Says: " + event.data;
    });
    // Display any errors that occur
    socket.addEventListener("error", function(event) {
      console.log('socket.addEventListener - error');
      message.textContent = "Error: " + event;
    });

    socket.addEventListener("close", function(event) {
      console.log('socket.addEventListener - close');
      console.log(event);
      open.disabled = false;
      status.textContent = "Not Connected";
    });

// Initialize everything when the window finishes loading
window.addEventListener("load", function(event) {
//  window.setInterval(function(){alert("TEST")}, 1000);
//})
//function connect() {
setTimeout(function(){
  //socket.send("HELLO");

//};
}, 100);
});

