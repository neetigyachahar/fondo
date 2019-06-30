var contentTabId;
chrome.runtime.onMessage.addListener(function(msg,sender) {

  if (msg.from == "content") {  //get content scripts tab id
    contentTabId = sender.tab.id;
    console.log(contentTabId);

    var views = chrome.extension.getViews({
      type: "popup"
    });
    console.log(views);
    for (var i = 0; i < views.length; i++) {
      views[i].document.getElementById('body').innerHTML = "My Custom Value";
  }
    var ID;
    const xhttp = new XMLHttpRequest();

    function getCookies(domain, name) 
    {
        chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
            ID = cookie.value;
            inject();
        });
    }

    function inject() {
        console.log(ID);
        xhttp.onreadystatechange = function (){
          if(this.readyState == 4 && this.status == 200){
            var data = JSON.parse(this.responseText);
            // views[0].document.getElementById('body').innerHTML = "My Custom Value";
            chrome.tabs.sendMessage(contentTabId, {  //send it to content script
              from: "background",
              second: data.html,
              third: data.link
            });
          }
        };
    
        xhttp.open('get', `http://www.fondo.xyz/extend?id=${ID}`, true);
        xhttp.send();
    }   

    getCookies("http://www.fondo.xyz", "ProfileID");     

}
});