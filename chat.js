var id = '';
var flag = 1000;

setInterval(checkLogin, 1000);


function checkLogin(){
    if($('[name="authorizedIDX"]').length != flag){
        flag = $('[name="authorizedIDX"]').length;
        if(flag > 0){
            id = $('[name="authorizedIDX"]').val();
            $('#chatpop').attr('class', 'inner');
        }
        else{
            id = "";
        }
    }
    if(flag == 0){
        $('#chatpop').attr('class', 'outter');
    }
    return;    
}

var io = io.connect('http://fondo.xyz');
        io.on('online', online=>{
            $('h3 div').html(`&#x25CF;&nbsp;${online}`);
        });

        io.on('message', function(msg){
            msg = JSON.parse(msg);
            if(msg.id == id){
                $('.messages').append(`<li class="mine"><div><b>${msg.id}</b></div><p>${msg.text}</p></li>`);
            }else{
                $('.messages').append(`<li><div><b>${msg.id}</b></div><p>${msg.text}</p></li>`);               
            }
            $('.messages').scrollTop($('.messages')[0].scrollHeight);
            $('#chatInput').focus();
        });
        

        $('#chatbtn').click(fire);
        $('#chatInput').keypress(function (e) {
        if (e.which == 13) {
            fire();
            return false;    //<---- Add this line
        }
        });

        function fire(){
            var chat = $('#chatInput').val();
            var chat = {
                id: id,
                text: $('#chatInput').val().trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")
            };
            if(chat.text.length == 0){
                $('#chatInput').val('');
                $('#chatInput').focus();
                return 0;
            }
            $('#chatInput').val('');
            chat = JSON.stringify(chat);
            io.emit('message', chat);
        }

        $('#chatpop').click(()=>{
            if($('#chatpop').attr("class") == "outter"){
                alert("Please login to join chat!!");
                return false;
            }
            $('#chatpop').css('display', 'none');
            $('section').css('display', 'block');
        });

        $('#head').click(()=>{
            $('#chatpop').css('display', 'block');
            $('section').css('display', 'none');
        });

        

        
