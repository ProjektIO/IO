$("#button").click(function(){
    $.post("/login_send", {"login": $("#login")[0].value, "password": $("#password")[0].value}, function(result){
    });
});
