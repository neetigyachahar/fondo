var xhttp = new XMLHttpRequest();

function togglenav(){
    var mysheet=document.styleSheets[0];
    var myrules=mysheet.cssRules? mysheet.cssRules: mysheet.rules;
    myrules = myrules[myrules.length-1].cssRules;
    for (i=0; i<myrules.length; i++){
    if(myrules[i].selectorText=="#navlist"){ //find "a:hover" rule
    visibilitycheck=myrules[i];
    break;
    }
    }

    if(visibilitycheck.style.visibility == "hidden")
        visibilitycheck.style.visibility = 'visible';
    else
        visibilitycheck.style.visibility = 'hidden';


    for (i=0; i<myrules.length; i++){
        if(myrules[i].selectorText=="#navlist li"){ //find "a:hover" rule
        heightcheck=myrules[i]; 
        break;
        }
        }

if(heightcheck.style.height == "0px")
    heightcheck.style.height = 'auto';
else
    heightcheck.style.height = '0px';
}
function search(){
var input = document.getElementById("searchbar");
input.addEventListener("keyup", function(event) {
    console.log("heyyo " + event.keyCode);
  if (window.event && window.event.keyCode == 13) {
    if(parseInt(input.value) != input.value){
        input.value = "";
        console.log("wrong!");
        alert("Only numerical ID allowed!!");
    }
    else{
    togglenav();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(xhttp.responseText);
            console.log(obj);
            document.getElementById('container').innerHTML = obj.html;
            if (obj.PhotoData.length === 0){
                if(obj.UserID == null){
                    document.getElementById('PROcontainerHead').innerHTML = "No Matches!";
                    document.getElementById('photolist').innerHTML = "";
                }
                else{
                    console.log(obj.UserID);
                    document.getElementById('PROcontainerHead').innerHTML = obj.html;
                    document.getElementById('id').innerHTML = obj.UserID;
                    document.getElementById('photolist').innerHTML = "No public photos found";
                    var pass = document.getElementById('passCs');
                    pass.name =  obj.UserID;
                    pass.addEventListener("keyup", function(event){
                        if(event.keyCode == 13){
                            xhttp.onreadystatechange = function() {
                                if (this.readyState == 4 && this.status == 200) {
                                    var result = JSON.parse(this.responseText);
                                    if (result.auth == true){
                                        setCookie("ProfileID", pass.name, 730);
                                        alert("Profile Added!");
                                    }
                                    else{
                                        alert("Wrong Password!");
                                        pass.value = "";
                                    }
                                }};                        
                            var passData = {
                                'password' : [ pass.name, pass.value]
                            }
                            xhttp.open("get", "?module=" + JSON.stringify(passData), true);
                            xhttp.send();
                        }
                    });
                }
            }
            else{
                console.log(obj.UserID);
                console.log(obj.PhotoData);
                document.getElementById('id').innerHTML = obj.PhotoData[0].UserID;
                var pass = document.getElementById('passCs');
                pass.name =  obj.UserID;
                pass.addEventListener("keyup", function(event){
                    if(event.keyCode == 13){
                        xhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                var result = JSON.parse(this.responseText);
                                if (result.auth == true){
                                    setCookie("ProfileID", pass.name, 730);
                                    alert("Profile Added!");
                                }
                                else{
                                    alert("Wrong Password!");
                                    pass.value = "";
                                }
                            }};                        
                        var passData = {
                            'password' : [ pass.name, pass.value]
                        }
                        xhttp.open("get", "?module=" + JSON.stringify(passData), true);
                        xhttp.send();
                    }
                });
                for (var i = 0; i<obj.PhotoData.length ; i++){
                    append(obj.PhotoData[i].SrNo);
                    document.getElementById(obj.PhotoData[i].SrNo).childNodes[1].src = obj.PhotoData[i].link;
                    document.getElementById(obj.PhotoData[i].SrNo).childNodes[3].innerHTML = "Created At: "+ ((obj.PhotoData[i].uploaded_at.split("T")).join("<br>")).substring(0,((obj.PhotoData[i].uploaded_at.split("T")).join("<br>").length-5));
                    console.log(document.getElementById('View').style);
                }
            }
        }
    };

    var data = getCookie("ProfileID");
    var obj = {
        'search' : input.value
    };
    xhttp.open("get", "?module=" + JSON.stringify(obj), true);
    xhttp.send();
  }
}
});
}

function checkNewID(){
    var input = document.getElementById('newID');
    var output = document.getElementById('test');
    input.addEventListener("keyup", function(event){
        if(parseInt(input.value) != input.value){
            output.innerText = "Only numbers allowed";
            document.getElementById('submitit').disabled = "true";
        }
        else{
            output.innerText = " ";
            input.value = (input.value).trim();
            xhttp.onreadystatechange = function(){
                if(this.status == 200 && this.readyState == 4){
                    var obj = this.responseText;
                    console.log(obj);
                    if(obj == "true"){
                        output.innerText = "ID already exists";
                        document.getElementById('submitit').disabled = "true";    
                    }
                    else{
                        output.innerText = " ";
                        document.getElementById('submitit').disabled = "";   
                    }
                }
            };
            var check = {
                "checkID" : input.value
            };
            xhttp.open("get", "?module="+JSON.stringify(check), true);
            xhttp.send();
        }
        if(input.value == ""){
            output.innerText = "";
            document.getElementById('submitit').disabled = "";
        }
    });
}

function create(){
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var obj = JSON.parse(this.responseText);
            document.getElementById('container').innerHTML = obj.html;
        }
    }

    var re = {
        'createPage' : "getThat"
    }

    xhttp.open("get", "?module="+JSON.stringify(re), true);
    xhttp.send();
}


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

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111
//!!!!!!!!!!!!!!!!!!!!PROFILE JS STARTS!!!!!!!!!!!!!!!!!!!!111
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111


function profile(){
    var id = document.getElementById('id');
    var pro = getCookie("ProfileID");
    if(pro.length != 0){
    document.getElementById('formCss').style = "visibility: visible;";
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(xhttp.responseText);
            console.log(obj);
            if (obj.PhotoData.length === 0){
                document.getElementById('photolist').innerHTML = "";
                document.getElementById('formCss').innerHTML = "";
                document.getElementById('PROcontainerHead').innerHTML = "No Data!";
            }
            else{
                id.innerText = pro;
                for (var i = 0; i<obj.PhotoData.length ; i++){
                    append(obj.PhotoData[i].SrNo);
                    document.getElementById(obj.PhotoData[i].SrNo).childNodes[1].src = obj.PhotoData[i].link;
                    document.getElementById(obj.PhotoData[i].SrNo).childNodes[3].innerHTML = obj.PhotoData[i].PhotoPrivacy+"<br>Created At: "+ ((obj.PhotoData[i].uploaded_at.split("T")).join("<br>")).substring(0,((obj.PhotoData[i].uploaded_at.split("T")).join("<br>").length-5));
                    document.getElementById('id').innerHTML = obj.PhotoData[i].UserID;
                    if (obj.PhotoData[i].SetWallpaper === 1){
                        document.getElementById(obj.PhotoData[i].SrNo).childNodes[3].style = "background-color: rgba(255, 0, 0, 0.4) !important;";
                        document.getElementById(obj.PhotoData[i].SrNo).childNodes[5].disabled = "true";
                    }
                }
            }
        }
    };


    var obj = {
        'profile' : pro
    };
    console.log(obj);
    xhttp.open("get", "?module=" + JSON.stringify(obj), true);
    xhttp.send();
    }
}

function append(id){
    var node = document.getElementById('photoFormat').cloneNode(true);
    var container = document.getElementById('photolist');
    node.id = id;
    container.appendChild(node);
}

function deletephoto(elem){
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var obj = JSON.parse(this.responseText);
            if (obj.del == true){
                window.location.href = "https://www.fondo.xyz/profile";
            }
            else{
                alert("Can't delete this background!!");
            }
        }
    };
    var deleteImage = {
        "delete" : elem.parentNode.id
    };
    xhttp.open("get", "?module="+ JSON.stringify(deleteImage), true);
    xhttp.send();
}

function setback(elem){
    console.log(elem.parentNode.id);
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var obj = JSON.parse(this.responseText);
            if(obj.reply == true){
            window.location.href = "https://www.fondo.xyz/profile";
            }
            else{
                alert("Can't set as background");
            }
        }
    };

    var setwall = {
        "setback" : elem.parentNode.id,
        "UserID" :  getCookie("ProfileID")
    };

    xhttp.open("get", "?module="+JSON.stringify(setwall), true);
    xhttp.send();
}

function toggleprivacy(elem){
    console.log(elem.parentNode.id);
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var obj = JSON.parse(this.responseText);
            console.log(obj);
            document.getElementById(elem.parentNode.id).childNodes[3].innerHTML = obj[0].PhotoPrivacy+"<br>Created At: "+ ((obj[0].uploaded_at.split("T")).join("<br>")).substring(0,((obj[0].uploaded_at.split("T")).join("<br>").length-5));
        }
    };

    var toggle = {
        "togglePrivacy" : elem.parentNode.id
    };

    xhttp.open('get', "?module="+JSON.stringify(toggle), true);
    xhttp.send();
}

function getSignedRequest1(file){
    console.log("yo");
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log("yo");
          var name_image = this.responseText + `.${(file.type).split('/')[1]}`; 
          xhttp.open('GET', `/sign-s3?file-name=${name_image}&file-type=${file.type}`);
          xhttp.onreadystatechange = () => {
          if(xhttp.readyState === 4){
              if(xhttp.status === 200){console.log("yo");
              const response = JSON.parse(xhttp.responseText);
              uploadFile1(file, response.signedRequest, response.url);
              }
              else{
              alert('Could not get signed URL.');
          }
      }
      };
      console.log("yo");
      xhttp.send();
        }
    }
    console.log("yo");
    xhttp.open("get", "/get_image_name", true);
    xhttp.send();
}

function uploadFile1(file, signedRequest, url){
    console.log("yo");
  xhttp.open('PUT', signedRequest);
  xhttp.onreadystatechange = () => {
    if(xhttp.readyState === 4){
      if(xhttp.status === 200){
        console.log("yo");
          console.log(url);
          document.getElementById("url1").value = url;
      }
      else{
        alert('Could not upload file.');
      }
    }
  };

  console.log("yo");
  xhttp.upload.addEventListener("progress", function(evt){
      if (evt.lengthComputable) {
        console.log("yo");
        console.log("add upload event-listener" + evt.loaded + "/" + evt.total);
        var elem = document.getElementById("myBar"); 
        width = (evt.loaded/evt.total)*100;
        console.log(width);
        elem.style.width = width + '%';
        document.getElementById("per").innerHTML = Math.round(width)+"%";
      }
    }, false);
    console.log("yo");
  xhttp.send(file);
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111
//!!!!!!!!!!!!!!!!!!!!PROFILE JS ENDS!!!!!!!!!!!!!!!!!!!!111
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111
//!!!!!!!!!!!!!!!!!!!!CREATE STARTS!!!!!!!!!!!!!!!!!!!!111
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111


function getSignedRequest(file){
      xhttp.onreadystatechange = function(){
          if(this.readyState == 4 && this.status == 200){
            var name_image = this.responseText + `.${(file.type).split('/')[1]}`; 
            xhttp.open('GET', `/sign-s3?file-name=${name_image}&file-type=${file.type}`);
            xhttp.onreadystatechange = () => {
            if(xhttp.readyState === 4){
                if(xhttp.status === 200){
                const response = JSON.parse(xhttp.responseText);
                uploadFile(file, response.signedRequest, response.url);
                }
                else{
                alert('Could not get signed URL.');
            }
        }
        };
        xhttp.send();
          }
      }
      xhttp.open("get", "/get_image_name", true);
      xhttp.send();
  }
  
  function uploadFile(file, signedRequest, url){
    xhttp.open('PUT', signedRequest);
    xhttp.onreadystatechange = () => {
      if(xhttp.readyState === 4){
        if(xhttp.status === 200){
            console.log(url);
            document.getElementById("url").value = url;
            document.forms["meraForm"].submit();
        }
        else{
          alert('Could not upload file.');
        }
      }
    };


    xhttp.upload.addEventListener("progress", function(evt){
        if (evt.lengthComputable) {
          console.log("add upload event-listener" + evt.loaded + "/" + evt.total);
          var elem = document.getElementById("myBar"); 
          width = (evt.loaded/evt.total)*100;
          console.log(width);
          elem.style.width = width + '%';
          document.getElementById("per").innerHTML = Math.round(width)+"%";
        }
      }, false);
    xhttp.send(file);
  }

