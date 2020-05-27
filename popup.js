// window.onload = (event) => { //Need to move this code into background.js. Only executes when popup.html is opended
//   console.log('page is fully loaded');
//   chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//       console.log("Tab Channged");
//       var url = "";
//       //console.log(changeInfo);
//       // console.log(changeInfo["url"]);
//       if (changeInfo.status == "loading") {
//           url = changeInfo["url"];
//           console.log(url);
//           if (url.endsWith("/submissions/")) {
//               console.log("In submissions");
//               chrome.tabs.query({
//                   active: true,
//                   currentWindow: true
//               }, function(tabs) {
//                   chrome.tabs.executeScript(
//                       tabs[0].id, {
//                           file: 'getSuccess.js'
//                       },
//                       function() {
//                           console.log("executing getsucess");
//                       });
//               });
//           }
//       }
//   });

// };


let getTimer = document.getElementById('getAlarm');
getTimer.onclick = function(element) {
  chrome.alarms.get("LeetcodeAlarm", function(alarms) { //* TODO: Make sure case with no alarms is covered */
      console.log("Schedule Time: " + alarms["scheduledTime"]);
      var d = new Date();
      var n = d.getTime();
      console.log("Current Time: " + n);
      var ms = alarms["scheduledTime"] - n;
      min = Math.floor((ms / 1000 / 60) << 0),
          sec = Math.floor((ms / 1000) % 60);

      console.log("Time left: " + min + ':' + sec);
  });
}

let clearAlarm = document.getElementById('clearAlarm');
clearAlarm.onclick = function(element) {
  chrome.runtime.sendMessage({ //Sending message to background.js to start the alarm
      data: "clearAlarm"
  }, function(response) {
  });
}