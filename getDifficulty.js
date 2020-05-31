//This is a content script  
//If this breaks it means the class name changed, which is very likely
document.onreadystatechange = function() {
  if (document.readyState == "complete") {
      console.log(document.readyState);
      //firstAsync();
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
            console.log("Hard");
        } else if (document.getElementsByClassName("css-dcmtd5")[0] != null) {
            chrome.storage.sync.set({
                difficulty: "medium"
            });
            console.log("Med");
        } else if (document.getElementsByClassName("css-14oi08n")[0] != null) {
            chrome.storage.sync.set({
                difficulty: "easy"
            });
            console.log("Easy");
        } else {
            //chrome.storage.sync.set({difficulty : "badCoder"});
            console.log("Something went wrong with the LeetCode Timer extension");
        }
        chrome.runtime.sendMessage({//Sending message to background.js to start the alarm
            data: "setAlarm"
        }, function(response) {
            //console.log(response);
        });
    }).catch((reason) =>{
        console.log(reason); 
        asyncCall();
    })

  }


//   async function asyncCall() {
//     const result = await resolveAfterSec();
//     console.log(result);
//     if(result == false){
//         asyncCall();
//     }else{
//         if (document.getElementsByClassName("css-t42afm")[0] != null) {
//             chrome.storage.sync.set({
//                 difficulty: "hard"
//             });
//             console.log("Hard");
//         } else if (document.getElementsByClassName("css-dcmtd5")[0] != null) {
//             chrome.storage.sync.set({
//                 difficulty: "medium"
//             });
//             console.log("Med");
//         } else if (document.getElementsByClassName("css-14oi08n")[0] != null) {
//             chrome.storage.sync.set({
//                 difficulty: "easy"
//             });
//             console.log("Easy");
//         } else {
//             //chrome.storage.sync.set({difficulty : "badCoder"});
//             console.log("Something went wrong with the LeetCode Timer extension");
//         }
//         chrome.runtime.sendMessage({//Sending message to background.js to start the alarm
//             data: "setAlarm"
//         }, function(response) {
//             //console.log(response);
//         });
//       //   console.log("Should have set the alarm");
//       //   console.log(document.getElementsByClassName("submit__2ISl")[0]);
//       }
//     }
  

async function firstAsync() {
  let promise = new Promise((res, rej) => {
        setTimeout(() => res("the difficulty not loaded yet"), 750)
  });
  // wait until the promise returns us a value
  let result = await promise;

  if (document.getElementById("initial-loading") != null) {
      console.log("Nope");
      //could probable use promise.catch() for the failed state in order to call the loop again
      firstAsync();
  } else { //The difficulty was sucessfully parsed
      if (document.getElementsByClassName("css-t42afm")[0] != null) {
          chrome.storage.sync.set({
              difficulty: "hard"
          });
          console.log("Hard");
      } else if (document.getElementsByClassName("css-dcmtd5")[0] != null) {
          chrome.storage.sync.set({
              difficulty: "medium"
          });
          console.log("Med");
      } else if (document.getElementsByClassName("css-14oi08n")[0] != null) {
          chrome.storage.sync.set({
              difficulty: "easy"
          });
          console.log("Easy");
      } else {
          //chrome.storage.sync.set({difficulty : "badCoder"});
          console.log("Something went wrong with the LeetCode Timer extension");
      }
      chrome.runtime.sendMessage({//Sending message to background.js to start the alarm
          data: "setAlarm"
      }, function(response) {
          //console.log(response);
      });
    //   console.log("Should have set the alarm");
    //   console.log(document.getElementsByClassName("submit__2ISl")[0]);
    }
}
