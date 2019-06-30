var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        document.body.innerHTML = this.responseText;
        if(getCookie('blur').length == 0){
            setCookie('blur', 0, 730);
        }
        if(getCookie('opacity').length == 0){
            setCookie('opacity', 1, 730);
        }
        var docu = document.getElementsByClassName('btn');
        var reading = document.getElementsByClassName('reading');

        docu[0].value = getCookie('blur');
        reading[0].innerHTML = `current value: ${getCookie('blur')}`;

        docu[1].value = getCookie('opacity');
        reading[1].innerHTML = `current value: ${getCookie('opacity')}`;

        console.log(getCookie('blur').length);
        
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id, {name: "knockknock"});
    port.postMessage({joke: "content.js connected!"});
    port.onMessage.addListener(function(msg) {
        if(msg.joke == "initiate"){
        var doc = document.getElementsByClassName('btn');
        var read = document.getElementsByClassName('reading');
        console.log("doc: " + doc.value);

        if(doc){
        doc[0].addEventListener("change", ()=>{
            read[0].innerHTML = `current value: ${doc[0].value}`;
            
            setCookie('blur', doc[0].value, 730);
            port.postMessage({
                header: "blur",
                value: doc[0].value
            });
        });

        doc[1].addEventListener("change", ()=>{
            read[1].innerHTML = `current value: ${doc[1].value}`;
            
            setCookie('opacity', doc[1].value, 730);
            port.postMessage({
                header: 'opacity',
                value: doc[1].value
            });
        });
        }
        port.postMessage({
            header: 'blur',
            value: getCookie('blur')
        });
        port.postMessage({
            header: 'opacity',
            value: getCookie('opacity')
        });
    }
});
  });
    }
}

xhttp.open("get", "http:www.fondo.xyz/popup", true);
xhttp.send();

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }  