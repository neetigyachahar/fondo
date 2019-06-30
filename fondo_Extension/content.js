chrome.runtime.sendMessage({from:"content"}); //first, tell the background page that this is the tab that wants to receive the messages.

chrome.runtime.onMessage.addListener(function(msg) {
  if (msg.from == "background") {
    var second = msg.second;
    var third = msg.third;
    console.log(msg);
    document.getElementsByTagName('body')[0].innerHTML += second;
    document.getElementById("image").src = third;

    chrome.runtime.onConnect.addListener(function(port) {
      console.assert(port.name == "knockknock");
      port.onMessage.addListener(function(msg) {
          console.log(msg);
          if(msg.joke == "content.js connected!")
            port.postMessage({joke: "initiate"});

          if(msg.header == "blur"){
            document.getElementById("background").style = `filter: blur(${msg.value}px);`;
          }

          if(msg.header == "opacity"){
            document.getElementById('page_outline').style = `opacity: ${msg.value};`;
          }
      });
    });
  }
});