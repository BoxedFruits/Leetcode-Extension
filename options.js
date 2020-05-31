let hardTime = document.getElementById("hardTime");
let mediumTime = document.getElementById("mediumTime");
let easyTime = document.getElementById("easyTime");

let hardButton = document.getElementById("hardButton");
let mediumButton = document.getElementById("mediumButton");
let easyButton = document.getElementById("easyButton");

let silentButton = document.getElementById("popupNotificationSilent");
let soundButton = document.getElementById("popupNotificationSound");

chrome.storage.sync.get(['hard'], function(result) {
  hardTime.value= result.hard;
});

chrome.storage.sync.get(['medium'], function(result) {
  mediumTime.value = result.medium;
});

chrome.storage.sync.get(['easy'], function(result) {
  easyTime.value = result.easy;
});

chrome.storage.sync.get(['silent'],function(result){
  if(result.silent == false){
    soundButton.checked = true;
    silentButton.checked = false;
  }else{
    silentButton.checked = true;
    soundButton.checked = false;
  }
})

hardButton.onclick = function(){
  var hardCurrent = parseInt(hardTime.value);
  chrome.storage.sync.set({
    hard: hardCurrent
    }, function() {
  });
}

mediumButton.onclick = function(){
  chrome.storage.sync.set({
    medium: parseInt(mediumTime.value)
    }, function() {
  });
}

easyButton.onclick = function(){
  chrome.storage.sync.set({
    easy: parseInt(easyTime.value)
    }, function() {
  });
}
silentButton.onclick = function(){
  if(silentButton.checked == true){
    chrome.storage.sync.set({
      silent: true
    });
  }
}

soundButton.onclick = function(){
  if(soundButton.checked == true){
    chrome.storage.sync.set({
      silent: false
    });
  }
}