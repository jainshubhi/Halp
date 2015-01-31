"use strict";
console.log('streamsource.js DEBUG');
var snapshots = [];
var socket;
    socket = new WebSocket("ws://" + window.location.host, "echo-protocol");
    socket.addEventListener("open", function(event) {
      //close.disabled = false;
      //send.disabled = false;
      //status.textContent = "Connected";
    });

    // Display messages received from the server
    socket.addEventListener("message", function(event) {
      console.log('socket.addEventListener - message');
      message.textContent = "Server Says: " + event.data;
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
function capture(video, scaleFactor) {
    if(scaleFactor == null){
        scaleFactor = 1;
    }
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.getElementById('canvas');
        canvas.width  = w;
        canvas.height = h;
    var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);

    //console.log('width:\t' + w + "\nheight:\t" + h);
    if (w != 0) {
        var imgdata = ctx.getImageData(0, 0, w, h).data;
        //console.log(imgdata);
        //console.log(Object.prototype.toString.call(imgdata));
        //socket.send(imgdata.buffer);
    }

    return canvas;
} 

function shoot(){
    var scaleFactor = 1;
    var video  = document.getElementById('video');
    //var output = document.getElementById('output');
    var canvas = capture(video, scaleFactor);
        canvas.onclick = function(){
            window.open(this.toDataURL());
        };
    //var dataURL = canvas.toDataURL();
    var dataURL = canvas.toDataURL("image/jpeg", 0.5);
    //console.log(dataURL);
    if (video.videoWidth != 0) {
      console.log("DEBUG 1: " + Object.prototype.toString.call(dataURL.toString()));
      //console.log(Object.prototype.toString.call(dataURL.data));
      console.log("DEBUG 2: " + Object.prototype.toString.call("HELLO"));
      //socket.send("HELLO");
      console.log("Hello: " + "Hello");
      //console.log("dataURL: " + dataURL.toString());
      socket.send(dataURL.toString());
      console.log("END");
    }
    //var JSONimg = {
    //  'type' : 'img',
    //  'data' : dataURL,
    //}
    //console.log(JSON.stringify(JSONimg));
    //socket.send(JSON.stringify(JSONimg));

    //canvas.toBlob(function(blob) {
    //  var newImg = document.createElement("img"),
    //      url = URL.createObjectURL(blob);
    //
    //  newImg.onload = function() {
    //    // no longer need to read the blob so it's revoked
    //    URL.revokeObjectURL(url);
    //  };
    //
    //  newImg.src = url;
    //  document.body.appendChild(newImg);
    //});

    //snapshots.unshift(canvas);
    //output.innerHTML = '';
    //for(var i=0; i<4; i++){
    //    //output.appendChild(snapshots[i]);
    //}
}
// Initialize everything when the window finishes loading
window.addEventListener("load", function(event) {
//  window.setInterval(function(){alert("TEST")}, 1000);
//})
//function connect() {
setTimeout(function(){
  var status = document.getElementById("status");
  var url = document.getElementById("url");
  var open = document.getElementById("open");
  var close = document.getElementById("close");
  var send = document.getElementById("send");
  var text = document.getElementById("text");
  var message = document.getElementById("message");


  //status.textContent = "Not Connected";
  //url.value = "ws://localhost:8080";
  url.value = "ws://" + window.location.host;
  close.disabled = true;
  send.disabled = true;

  // Create a new connection when the Connect button is clicked
  open.addEventListener("click", function(event) {
    open.disabled = true;
    //socket = new WebSocket(url.value, "echo-protocol");
    console.log('open.addEventListener');

    socket.addEventListener("open", function(event) {
      close.disabled = false;
      send.disabled = false;
      status.textContent = "Connected";
    });

    // Display messages received from the server
    socket.addEventListener("message", function(event) {
      console.log('socket.addEventListener');
      message.textContent = "Server Says: " + event.data;
    });
    // Display any errors that occur
    socket.addEventListener("error", function(event) {
      console.log('socket.addEventListener');
      message.textContent = "Error: " + event;
    });

    socket.addEventListener("close", function(event) {
      console.log('socket.addEventListener');
      open.disabled = false;
      status.textContent = "Not Connected";
    });
  });

  // Close the connection when the Disconnect button is clicked
  close.addEventListener("click", function(event) {
    close.disabled = true;
    send.disabled = true;
    message.textContent = "";
    socket.close();
  });

  // Send text to the server when the Send button is clicked
  send.addEventListener("click", function(event) {
    socket.send(text.value);
    console.log(Object.prototype.toString.call(text.value));
    text.value = "";
  });

  navigator.getUserMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);
  
  if (navigator.getUserMedia) {
     navigator.getUserMedia (
  
        // constraints
        {
           video: true,
           audio: true: {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
           }
        },
  
        // successCallback
        function(localMediaStream) {
           var video = document.querySelector('video');
           video.src = window.URL.createObjectURL(localMediaStream);
           // Do something with the video here, e.g. video.play()
           document.getElementById("frames").innerHTML = 0;

           requestAnimationFrame(draw);
        },

        // errorCallback
        function(err) {
           console.log("The following error occured: " + err);
        }
     );
     var i = 0;
     
     video.addEventListener('loadeddata', function() {
     
         video.currentTime = i;
     
     }, false);

     video.addEventListener('seeked', function() {

         /// now video has seeked and current frames will show
         /// at the time as we expect
         //generateThumbnail(i);
 
         /// when frame is captured, increase
         i += 5;
 
         /// if we are not passed end, seek to next interval
         if (i <= video.duration) {
             /// this will trigger another seeked event
             video.currentTime = i;
 
         } else {
             /// DONE!, next action
         }

     }, false);

  
  } else {
     alert("getUserMedia not supported");
  }

//};
}, 100);
});

function draw() {
  //console.log("TEST");
  document.getElementById("frames").innerHTML = parseInt(document.getElementById("frames").innerHTML) + 1;
  var frame = document.getElementById("video");
  shoot();
  //var frame = readFrame();

  //if (frame) {
  //  replaceGreen(frame.data);
  //  context.putImageData(frame, 0, 0);
  //}

  // Wait for the next frame.
  setTimeout(function(){
    requestAnimationFrame(draw);
  }, 150);
}




