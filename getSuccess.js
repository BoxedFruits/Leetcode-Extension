if (document.getElementsByClassName("success__3Ai7")[0] != null) {
  console.log("passed the test cases. turning off alarm");
  chrome.runtime.sendMessage({
      data: "updateLastTime"
  }, function() {
      chrome.runtime.sendMessage({ //Sending message to background.js to start the alarm
          data: "clearAlarm"
      });
  });
}