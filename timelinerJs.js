$(document).ready(function(){

    $.ajax({
        url: "http://www.fondo.xyz/fbjnvc",
        success: (data)=>{
            alert(data);
        }
    });


    $(".mdl-button").click(function(){
      if($("#create").css("display") == "none"){
        $("#create").css("display","block");
      $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      }
      else{
        $("#create").css("display","none");
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