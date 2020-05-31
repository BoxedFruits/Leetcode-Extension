chrome.runtime.onInstalled.addListener(function(details) {
    //This is where the time for different difficulty will be stored
    chrome.storage.sync.set({
      easy: 20,
      medium: 30,
      hard: 45,
      lastTime: 0,
      silent:false
      }, function() {
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
        var silentAlarm;
        chrome.storage.sync.get(['silent'],function(result){
          silentAlarm = result.silent;
          chrome.notifications.create({
            type:     'basic',
            iconUrl:  'LeetCode_logo.png',
            title:    'Leetcode Extension',
            message:  'The timer has run out ' + silentAlarm,
            requireInteraction: true,
            silent: silentAlarm,
            buttons: [
              {title: 'Leetcode Alarm'}
            ],
            priority: 0});
        });

      });

      chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        console.log(sender);
        if (message.data == "setAlarm") {
          chrome.storage.sync.get(["difficulty"],function(result){
            chrome.storage.sync.get([result.difficulty],function(time){
              chrome.alarms.create("LeetcodeAlarm",{ delayInMinutes: time[result.difficulty]});
            });
          });
          sendResponse({});
          return true;
        }else if(message.data == "clearAlarm"){
          chrome.alarms.clear("LeetcodeAlarm");
          chrome.alarms.getAll(function(time){
              console.log(time);
            });
            sendResponse({});
            //return true;
        }
        if(message.data == "clearLastTime"){
            chrome.storage.sync.set({
              lastTime: 0
              });
        }else if(message.data == "updateLastTime"){
          chrome.alarms.get("LeetcodeAlarm", function(alarms) {
            if(alarms !== undefined){
              chrome.storage.sync.set({lastTime: alarms["scheduledTime"] - Date.now()})
            }
            });
        }
      });

      //Figuring out when the Submission requests are done
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                {file: 'getSuccess.js'},function(){
                });
              });
        },
        {urls: ["https://statsd-frontend.leetcode.com/timing/time_return_judge"]},
        ["extraHeaders","requestBody"]);
      
  });

