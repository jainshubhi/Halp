
// http://webaudiodemos.appspot.com/AudioRecorder/index.html
// http://webaudiodemos.appspot.com/AudioRecorder/js/recorderjs/recorder.js
/*License (MIT)

Copyright Â© 2013 Matt Diamond

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of 
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
*/

  var WORKER_PATH = 'js/recorderjs/recorderWorker.js';
  //var WORKER_PATH = '#!/recorderjs.js';
  //var WORKER_PATH = 'http://www.webaudiodemos.appspot.com/AudioRecorder/js/recorderjs/recorder.js';

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    if(!this.context.createScriptProcessor){
       this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    } else {
       this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
    }
   
    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    var recording = false,
      currCallback;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    }

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffers = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffers' })
    }

    this.exportWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    }

    this.exportMonoWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportMonoWAV',
        type: type
      });
    }

    worker.onmessage = function(e){
      var blob = e.data;
      currCallback(blob);
    }

    source.connect(this.node);
    this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
  };

  Recorder.setupDownload = function(blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = document.getElementById("save");
    link.href = url;
    link.download = filename || 'output.wav';
  }

  window.Recorder = Recorder;

// END OF COPIED CODE

"use strict";
//console.log('streamsource.js DEBUG');
var audioRecorder = 1;
var snapshots = [];
var socket;
    socket = new WebSocket("ws://" + window.location.host, "echo-protocol");
var asocket = new WebSocket("ws://" + window.location.host, "audio-socket");
socket.binaryType = "blob";
    socket.addEventListener("open", function(event) {
      //close.disabled = false;
      //send.disabled = false;
      //status.textContent = "Connected";
    });

    // Display messages received from the server
    socket.addEventListener("message", function(event) {
      //console.log('socket.addEventListener - message');
      message.textContent = "Server Says: " + event.data;
    });
    // Display any errors that occur
    socket.addEventListener("error", function(event) {
      //console.log('socket.addEventListener - error');
      message.textContent = "Error: " + event;
    });

    socket.addEventListener("close", function(event) {
      //console.log('socket.addEventListener - close');
      //console.log(event);
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

function sendAudio( blob ) {
console.log("DEBUG");
  var audiodata = document.getElementById("audiodata");
  audiodata.textvalue = blob;
console.log(blob);
  asocket.send(blob);

    //Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    //recIndex++;
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
      //console.log("DEBUG 1: " + Object.prototype.toString.call(dataURL.toString()));
      //console.log(Object.prototype.toString.call(dataURL.data));
      //console.log("DEBUG 2: " + Object.prototype.toString.call("HELLO"));
      //socket.send("HELLO");
      //console.log("Hello: " + "Hello");
      //console.log("dataURL: " + dataURL.toString());

      socket.send(dataURL.toString());
      audioRecorder.exportWAV( sendAudio );
      audioRecorder.clear();
      //console.log("END");
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
    //console.log('open.addEventListener');

    socket.addEventListener("open", function(event) {
      close.disabled = false;
      send.disabled = false;
      status.textContent = "Connected";
    });

    // Display messages received from the server
    socket.addEventListener("message", function(event) {
      //console.log('socket.addEventListener');
      message.textContent = "Server Says: " + event.data;
    });
    // Display any errors that occur
    socket.addEventListener("error", function(event) {
      //console.log('socket.addEventListener');
      message.textContent = "Error: " + event;
    });

    socket.addEventListener("close", function(event) {
      //console.log('socket.addEventListener');
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
    //console.log(Object.prototype.toString.call(text.value));
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
           audio: true
           //{
           //     "mandatory": {
           //         "googEchoCancellation": "false",
           //         "googAutoGainControl": "false",
           //         "googNoiseSuppression": "false",
           //         "googHighpassFilter": "false"
           //     },
           //     "optional": []
           //}
        },
  
        // successCallback
        function(localMediaStream) {
console.log("DEFINE audioRecorder")
           var video = document.querySelector('video');
           video.src = window.URL.createObjectURL(localMediaStream);
           // Do something with the video here, e.g. video.play()
           document.getElementById("frames").innerHTML = 0;
           //audio.src = window.URL.createObjectURL(localMediaStream);


           window.AudioContext = window.AudioContext || window.webkitAudioContext;

           var audioContext = new AudioContext();

           var inputPoint = audioContext.createGain();

           var realAudioInput = audioContext.createMediaStreamSource(localMediaStream);
           var audioInput = realAudioInput;
           audioInput.connect(inputPoint);

           var analyserNode = audioContext.createAnalyser();
           analyserNode.fftSize = 2048;
           inputPoint.connect( analyserNode );

           audioRecorder = new Recorder( inputPoint );
           audioRecorder.record();

           var zeroGain = audioContext.createGain();
           zeroGain.gain.value = 0.0;
           inputPoint.connect( zeroGain );
           zeroGain.connect( audioContext.destination );


           requestAnimationFrame(draw);
        },

        // errorCallback
        function(err) {
           //console.log("The following error occured: " + err);
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
  }, 200);
}



