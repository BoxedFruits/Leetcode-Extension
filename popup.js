var interval;
var newDelay;
let timer = document.getElementById("timer");
let pauseAlarm = document.getElementById('pauseAlarm');
let getTimer = document.getElementById('getAlarm');
let clearAlarm = document.getElementById('clearAlarm');
let resetAlarm = document.getElementById('resetAlarm');

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  chrome.alarms.get("LeetcodeAlarm", function(alarms) {
    if(alarms !== undefined){
      var n = Date.now();
      var ms = alarms["scheduledTime"] - n;
      min = Math.floor((ms / 1000 / 60) << 0),
      sec = Math.floor((ms / 1000) % 60);
      console.log("Time left: " + min + ':' + sec);
      updateTimer(ms);
    }else{
      //console.log("No alarm");
      clearInterval(interval);
      // timer.innerText = ("Time Left: 00:00");
      chrome.storage.sync.get(['lastTime'],function(result){
        if (result !== undefined && result.lastTime != 0 ){
          var lastTime = result.lastTime;
          var minLastTime = Math.floor((lastTime / 1000 / 60) << 0);
          var secLastTIme = Math.floor((lastTime / 1000) % 60);
          var minStrLastTime = minLastTime.toString();
          var secStrLastTIme = secLastTIme.toString();
          var delay = minStrLastTime.padStart(2,'0') + ":" + secStrLastTIme.padStart(2,'0');
          pauseAlarm.value = "OFF";
          pauseAlarm.innerText = "Resume Alarm";
          newDelay = lastTime;
          timer.innerText = ("Time Left: " + delay);
          console.log("Time Left: " + delay);
        }else{
          timer.innerText = ("Time Left: 00:00");
        }
      });
    }
  });
});

function updateTimer(ms){
  var min;
  var sec;
  interval = setInterval(function(){
    if(ms > 0){
      min = Math.floor((ms / 1000 / 60) << 0),
      sec = Math.floor((ms / 1000) % 60);
      var minStr = min.toString();
      var secStr = sec.toString();
      var delay = minStr.padStart(2,'0') + ":" + secStr.padStart(2,'0');
      timer.innerText = ("Time Left: " + delay);
      ms-= 1000;
    }else{
      clearInterval(interval);
    }
  },1000);
}

clearAlarm.onclick = function(element) {
  chrome.runtime.sendMessage({ //Sending message to background.js to start the alarm
      data: "clearAlarm"
  }, function(response) {
  chrome.runtime.sendMessage({
      data: "clearLastTime"
    });
    clearInterval(interval);
    pauseAlarm.value = "ON";
    pauseAlarm.innerText = "Pause Alarm";
    timer.innerText = ("Time Left: 00:00");
  });
}

resetAlarm.onclick = function(){
  //This would be a good place to do a JS promise
  //Have to create the alarm here because async nature of the API makes it difficult to set display the new time correctly
  chrome.storage.sync.get(["difficulty"], function(result) {
    chrome.storage.sync.get([result.difficulty], function(time) {
        console.log(time[result.difficulty]);
        chrome.alarms.create("LeetcodeAlarm", {
            delayInMinutes: time[result.difficulty]
        });
        chrome.alarms.get("LeetcodeAlarm", function(alarms) {
            clearInterval(interval);
            updateTimer(alarms["scheduledTime"] - Date.now());
            pauseAlarm.value = "ON";
            pauseAlarm.innerText = "Pause Alarm";
        });
    });
});
}


var alarmTime;
pauseAlarm.onclick = function(){
  var pausedTime = Date.now(); //This is in ms
   if(pauseAlarm.value == "ON"){
    chrome.alarms.get("LeetcodeAlarm", function(alarms){
      if(alarms !== undefined){
        alarmTime = alarms["scheduledTime"];
        newDelay = alarmTime - pausedTime;
        pauseAlarm.value = "OFF";
        pauseAlarm.innerText = "Resume Alarm";
        chrome.runtime.sendMessage({
          data:"clearAlarm"
        }); 
        clearInterval(interval);
        chrome.storage.sync.set({
          lastTime: newDelay
          });
      }else{
            pauseAlarm.value = "ON";
            pauseAlarm.innerText = "Pause Alarm";}
    });

  }else{
    console.log(newDelay);
    pauseAlarm.value = "ON";
    pauseAlarm.innerText = "Pause Alarm";
    chrome.alarms.create("LeetcodeAlarm",{ when: Date.now() + newDelay
    });
    updateTimer(newDelay);
  }
}
// For debugging
getTimer.onclick = function(element) {
  chrome.alarms.get("LeetcodeAlarm", function(alarms) { //* TODO: Make sure case with no alarms is covered */
      if(alarms !== undefined){
        console.log("Schedule Time: " + alarms["scheduledTime"]);
        var d = new Date();
        var n = d.getTime();
        console.log("Current Time: " + n);
        var ms = alarms["scheduledTime"] - Date.now();
        min = Math.floor((ms / 1000 / 60) << 0),
        sec = Math.floor((ms / 1000) % 60);
        console.log("Time Left: " + min + ':' + sec);
        // updateTimer(ms);
      }else{
        console.log("No alarm");
      }
  });
}