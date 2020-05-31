//This is a content script  
//If this breaks it means the class name changed, which is very likely
document.onreadystatechange = function() {
  if (document.readyState == "complete") {
        (async () => {
            await asyncCall();
        })();
  }
}

function resolveAfterSec() {
    return new Promise((resolve,reject) => { 
        var difficultyLoaded = document.getElementsByClassName("submit__2ISl")[0] != null ? true : false;

        if(difficultyLoaded){
            resolve(difficultyLoaded);
        }else{
            setTimeout(() => {
                reject("Not loaded yet, retrying in 550ms");
            }, 550);
        }
    });
  }

  async function asyncCall(){
    let result = resolveAfterSec();
    result.then((resolve)=> {
        if (document.getElementsByClassName("css-t42afm")[0] != null) {
            chrome.storage.sync.set({
                difficulty: "hard"
            });
        } else if (document.getElementsByClassName("css-dcmtd5")[0] != null) {
            chrome.storage.sync.set({
                difficulty: "medium"
            });
        } else if (document.getElementsByClassName("css-14oi08n")[0] != null) {
            chrome.storage.sync.set({
                difficulty: "easy"
            });
        } else {
            console.log("Something went wrong with the LeetCode Timer extension");
        }
        chrome.runtime.sendMessage({//Sending message to background.js to start the alarm
            data: "setAlarm"
        }, function(response) {
            //console.log(response);
        });
    }).catch((reason) =>{
        asyncCall();
    })
  }

