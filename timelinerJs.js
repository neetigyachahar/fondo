$(document).ready(function(){

    // $.ajax({
    //     url: "http://localhost:3000/timeliner/",
    //     success: (data)=>{
    //         alert(data);
    //     }
    // });
    var SavedID = getCookie('ID');
    if( SavedID.length != 0){
      $.ajax({
        url: `http://localhost:3000/timeliner/getID?ID=${SavedID}`,
        success: (data)=>{
          $("footer span").text(SavedID);
          $("footer").css("display", "block");

            alert(data);
        }
    });
    }
    else{
      $("#notFound").css("display", "block");
      $("footer").css("display", "none");
    }

    function search(){
      $.ajax({
        url: `http://localhost:3000/timeliner/search?ID=${$("#search").val()}`,
        success: (data)=>{
            alert(data);
            if(data == "not found"){
              alert("ID doesn't exist!");
            }
            else{
              setCookie("ID", data, 730);
              location.reload();
            }
        }
    });
    }

    $(".mdl-button").click(function(){
      if($("#create").css("display") == "none"){
        $("#create").css("display","block");
        $("#notFound").css("display", "none");
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      }
      else{
        $("#create").css("display","none");
        $("#notFound").css("display", "block");
      }
    });

    $(document).click(function() {
      $("legend").removeClass("animate");
      $("legend").addClass("animateEnd");
      $("#prog").css("display", "none");
    });

    $("legend").click(function(event) {
      $("legend").removeClass("animate");
        $("legend").addClass("animateEnd");
        $("#prog").css("display", "none");
        $(this).removeClass("animateEnd");
        $(this).addClass("animate");
        console.log($(this).siblings("#prog").css("display", "block"));
        event.stopPropagation();
    });

    $("fieldset").click(function(event) {
      var thisClass = $(this).children("legend").attr("class");
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