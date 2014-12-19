//

var easyrtc = require('/modules/core/js/easyrtc/easyrtc.js');


//
var selfEasyrtcid = "";
function addToConversation(who, msgType, content) {
    // Escape html special characters, then add linefeeds.
    content = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    content = content.replace(/\n/g, '<br />');
    document.getElementById('conversation').innerHTML +=
    "<b>" + who + ":</b>&nbsp;" + content + "<br />";
}


function connect2() {
    easyrtc.setPeerListener(addToConversation);
    easyrtc.setRoomOccupantListener(convertListToButtons2);
    easyrtc.connect("easyrtc.instantMessaging", loginSuccess2, loginFailure2);
}


function convertListToButtons2 (roomName, occupants, isPrimary) {
    var otherClientDiv = document.getElementById('otherClients2');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }

    for(var easyrtcid in occupants) {
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                sendStuffWS(easyrtcid);
            };
        }(easyrtcid);
        var label = document.createTextNode("Send to " + easyrtc.idToName(easyrtcid));
        button.appendChild(label);

        otherClientDiv.appendChild(button);
    }
    if( !otherClientDiv.hasChildNodes() ) {
        otherClientDiv.innerHTML = "<em>Nobody else logged in to talk to...</em>";
    }
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


function loginSuccess2(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    document.getElementById("iam2").innerHTML = "I am " + easyrtcid;
}


function loginFailure2(errorCode, message) {
    easyrtc.showError(errorCode, message);
}
