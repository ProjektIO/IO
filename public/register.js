$("#button").click(function(){
    $.post("/registarion_send", {"login": $("#login")[0].value, "password": $("#password")[0].value}, function(result){
        $("#lol").html(result);
    });
});
