chrome.runtime.onInstalled.addListener(function(details) {
    //This is where the time for different difficulty will be stored
    chrome.storage.sync.set({
      color: '#3aa757',
      easy: 1,
      medium: 2,
      hard: 3
      }, function() {
      console.log("The color is green.");
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'leetcode.com',
                    pathContains: 'problems/'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });

    
      chrome.alarms.onAlarm.addListener(function(){
        chrome.notifications.create({
            type:     'basic',
            iconUrl:  'LeetCode_logo.png',
            title:    'Dis the leetcode timer doe',
            message:  'The timer has run out',
            buttons: [
              {title: 'Leetcode Alarm'}
            ],
            priority: 0});
      });
      chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        console.log(sender);
        if (message.data == "setAlarm") {
          chrome.storage.sync.get(["difficulty"],function(result){
            chrome.storage.sync.get([result.difficulty],function(time){
              console.log(time[result.difficulty]);
              //chrome.alarms.create("LeetcodeAlarm",{ delayInMinutes: time[result.difficulty]});
               chrome.alarms.create("LeetcodeAlarm",{ delayInMinutes: 1});
            });
          });
        }else if(message.data == "getSuccess"){
          console.log("background js getSuccess");
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                {file: 'getSuccess.js'},function(){
                  console.log("executing getsucess");
                });
                chrome.alarms.getAll(function(time){
                  console.log(time);
                });
           });
        }else if(message.data == "clearAlarm"){
          chrome.alarms.clear("LeetcodeAlarm");
          chrome.alarms.getAll(function(time){
              console.log(time);
            });
        }
      });

      //Figuring out when the Submission requests are done
      //Now need to either inject js to find if success or failed
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          console.log("went to evil.com"); 
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                {file: 'getSuccess.js'},function(){
                  console.log("executing getsucess");
                });
              });
        },
        {urls: ["https://statsd-frontend.leetcode.com/timing/time_return_judge"]},
        ["extraHeaders","requestBody"]);
      
  });

