$(document).ready(function(){
    getTopics();
    document.body.requestFullscreen();

  $("#newID").click(()=>{
    $('[name="ID"]').css("display", "block");
    $('[name="ID"]').val(" ");
    $('#n').text(1);
    $("#newID").css("visibility", "hidden");
  });
    

    $("#submit").click(()=>{
      console.log("hey4");
      if($('[name="ID"]').val().length != 0 && $('[name="topicName"]').val().length != 0  ){
        if($('[name="topicName"]').val().length != 0){
          $.ajax({
            url: `http://www.fondo.xyz/timeliner/createTopic?N=${$('#n').text()}&ID=${$('[name="ID"]').val()}&topicName=${$('[name="topicName"]').val()}`,
            success: (data)=>{
                if(data == "ID Successfully Created!"){
                  setCookie("ID", $('[name="ID"]').val());
                  getTopics();
                }
                else if(data == 'Topic Added!'){
                  alert(data);
                  getTopics();
                }
                else{
                  alert(data);
                }
            }
        });
        }
      }
      else{
        alert("Please enter a ID and Topic!");
      }
    });

    $(".mdl-button").click(function(){
      if($("#create").css("display") == "none"){
        $("#create").css("display","block");
        $("#newID").css("visibility", "visible");
        notFound();
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      }
      else{
        $("#create").css("display","none");
        $('#n').text(0);
        $('[name = "ID"]').css("display", "none");
        notFound();
      }
    });

    $(document).click(function() {
      console.log("hey1");
      $("legend").removeClass("animate");
      $("legend").addClass("animateEnd");
      $(".update").css("display", "none");
    });

    $("section").on("click", "legend", function(event) {
      console.log("hey2");
        $("legend").removeClass("animate");
        $("legend").addClass("animateEnd");
        $(".update").css("display", "none");
        $(this).removeClass("animateEnd");
        $(this).addClass("animate");
        $(this).siblings(".update").css("display", "block");
        event.stopPropagation();
    });

    $("section").on("click", "fieldset", function(event) {
      var thisClass = $(this).children("legend").attr("class");
      console.log("hey3");
      if(thisClass == "animate"){
        event.stopPropagation();
      }
    });
});
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

function notFound(){
  if(getCookie("ID").length == 0){
    if($("#notFound").css("display") == "block"){
      $("#notFound").css("display", "none");
    }
    else{
      $("#notFound").css("display", "block");
    }
  }
  else{
    $("#notFound").css("display", "none");
  }
}

function getTopics(){
  var SavedID = getCookie('ID');
  if( SavedID.length != 0){
    console.log("hrhrhr");
    $.ajax({
      url: `http://www.fondo.xyz/timeliner/getID?ID=${SavedID}`,
      success: (data)=>{
        console.log(JSON.parse(data));
        data = JSON.parse(data);
        $("footer span").text(SavedID);
        $("footer").css("display", "block");
        $('[name="ID"]').val(SavedID);
        $("section").text("");
        notFound();
        if($("#create").css("display") != "none"){
          $(".mdl-button").trigger("click");
        }
        for(var topic in data){
          var topic_i = Object.keys(data).indexOf(topic);
          console.log(topic_i);
          $("#model").clone().appendTo("section");
          $("section fieldset").last().attr("id", topic_i);
          console.log($(`#${topic_i}`).attr("id"));
          console.log(topic);
          $(`#${topic_i} legend`).text(topic);
          for(var i in data[topic]){
            console.log((data[topic][i][1]).split("T"));
            var tim = (((data[topic][i][1]).split("T")).join("<br>")).substring(0,(((data[topic][i][1]).split("T")).join("<br>").length-5));
            $(`#${topic_i} .flow`).append(`<br><p><span>${tim}</span> | ${data[topic][i][0]}</p>`);
            $(`#${topic_i} .update`).siblings(".ID").val(getCookie("ID"));
            $(`#${topic_i} .update`).siblings(".Topic").val(topic);
          }

        }
      }
  });
  }
  else{
    notFound();
    $("footer").css("display", "none");
  }
}

function search(){
  $.ajax({
    url: `http://www.fondo.xyz/timeliner/search?ID=${$("#search").val()}`,
    success: (data)=>{
        if(data == "not found"){
          alert(data);
        }
        else{
          setCookie("ID", $("#search").val(), 730);
          getTopics();
          console.log("dododo");
        }
    }
});
}

function fire(t){
   var topic = $(`#${$(t).parent().parent().attr("id")}`).children("legend").text();
   var fire =  $(`#${$(t).parent().parent().attr("id")}`).find(".progress").val();
   console.log(fire.length);
   if(fire.length != 0){
   console.log(topic);
   var para = {
      "ID": getCookie("ID"),
      "topic": topic,
      "fire": fire
   };

    $.ajax({
        url: `http://www.fondo.xyz/timeliner/fire?p=${JSON.stringify(para)}`,
        success: (data)=>{
            if(data == "lit!"){
              getTopics();
            }
            alert(data);
        }
    });
  }
  else{
    alert("Enter topic name!");
  }
}