var selfEasyrtcid = "";
var otherEasyrtcids = [];

function connect() {
    easyrtc.setVideoDims(640,480);
    easyrtc.setPeerListener(addToConversation);
    easyrtc.setRoomOccupantListener(convertListToButtons);
    //easyrtc.connect("server_name",
    //              function(easyrtcid, roomOwner){
    //                  if (roomOwner){ console.log("I'm the room owner"); }
    //                  console.log("my id is " + easyrtcid);
    //              },
    //              function(errorText){
    //                  console.log("failed to connect ", erFrText);
    //              });
    document.getElementById('rooms').innerHTML = 'Have not checked rooms yet';
    //easyrtc.joinRoom('testroom', null,
    //    function(roomname){
    //        console.log('could join room');
    //        document.getElementById('rooms').innerHTML = '';
    //    },
    //    function(errorCode, errorText, roomname){
    //        console.log('could not join room');
    //        document.getElementById('rooms').innerHTML = '';
    //    }
    //);
    easyrtc.easyApp("test", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
    document.getElementById('newRoomSubmit').onclick = function() {
                                                           var roomName = document.getElementById('newRoomName').value;
                                                           document.getElementById('newRoomName').value = '';
                                                           easyrtc.joinRoom(roomName, null,
                                                               function(roomname){
                                                                   console.log('could join room');
                                                                   updateRooms();
                                                               },
                                                               function(errorCode, errorText, roomname){
                                                                   console.log('could not join room');
                                                               }
                                                           );
                                                       };
    document.getElementById('updateRooms').onclick = function() {
                                                         updateRooms();
                                                     };
 }


function clearConnectList() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }

    var otherClientDiv = document.getElementById('otherClients2');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }

    otherEasyrtcids = [];
}


function convertListToButtons (roomName, data, isPrimary) {
    clearConnectList();

    var otherClientDiv = document.getElementById('otherClients');
    for(var easyrtcid in data) {
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            };
        }(easyrtcid);

        var label = document.createTextNode(easyrtc.idToName(easyrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }


    if(otherClientDiv.hasChildNodes()) {

      var otherClientDiv = document.getElementById('otherClients2');
      var button = document.createElement('button');
      button.onclick = function(data) {
          return function() {
              for(var easyrtcid in data) {
                  sendStuffWS(easyrtcid);
              }
          };
      }(data);
      var label = document.createTextNode("Send");
      button.appendChild(label);

      otherClientDiv.appendChild(button);
    } else {
      otherClientDiv.innerHTML = "<em>Nobody else logged in to talk to...</em>";

    }
}


function performCall(otherEasyrtcid) {
    easyrtc.hangupAll();

    var successCB = function() {};
    var failureCB = function() {};
    easyrtc.call(otherEasyrtcid, successCB, failureCB);
}


function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
    updateRooms();
}


function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}

function updateRooms() {
    easyrtc.getRoomList(
        function(roomList){
           document.getElementById('rooms').innerHTML = '';
           for(roomName in roomList){
               var button = document.createElement('button');
               var newline = document.createElement('br');
               button.onclick = function(roomName) {
                                    return function(){
                                        easyrtc.joinRoom(roomName, null,
                                            function(roomname){
                                                updateRooms();
                                                console.log('could join room');
                                            },
                                            function(errorCode, errorText, roomname){
                                                console.log('could not join room');
                                            }
                                        );
                                    }
                                }(roomName);

               var label = document.createTextNode(easyrtc.idToName(roomName));
               button.appendChild(label);
               document.getElementById('rooms').appendChild(button);
               document.getElementById('rooms').appendChild(newline);
           }
         },
         function(errorCode, errorText){
            easyrtc.showError(errorCode, errorText);
         }
    );
    document.getElementById('myRooms').innerHTML = Object.keys(easyrtc.getRoomsJoined());
}

function addToConversation(who, msgType, content) {
    // Escape html special characters, then add linefeeds.
    content = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    content = content.replace(/\n/g, '<br />');
    document.getElementById('conversation').innerHTML +=
    "<b>" + who + ":</b>&nbsp;" + content + "<br />";
}


function sendStuffWS(otherEasyrtcid) {
    var text = document.getElementById('sendMessageText').value;
    if(text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
        return;
    }

    easyrtc.sendDataWS(otherEasyrtcid, "message",  text);
    addToConversation("Me", "message", text);
    document.getElementById('sendMessageText').value = "";
}
