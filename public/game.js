"use strict";
var game = {
	new_message : function(message)	{
		console.log(message);
		$("#duzydiv").append(message.type + " : ");
		$("#duzydiv").append(message.info);
		$("#duzydiv").append("</br>");
	}
}


var connection = new GameConnection(game);

$("#button").click(function(){connection.send($("#msg").val())
		$("#msg").empty();
		$("#duzydiv").append("Ja : "+$("#msg").val());
		$("#duzydiv").append("</br>");
});

/*
	$.post("/access_game", {}, function(result){
	    	var tk = JSON.parse(result);
	            $("#duzydiv").append( "POŁĄCZONO, WEWNĘTRZNY TOKEN GRY:");
	            $("#duzydiv").append(tk.token);
	            $("#duzydiv").append("<br>");
		    console.log(tk.token);
		    socket.emit('hi', tk.token);
  socket.on('msg', function(msg){
	  var msg2 = JSON.parse(msg);
	  if(msg2.type == "server")
	  {
	            $("#duzydiv").append("<b>");
	  }
	            $("#duzydiv").append(msg2.message.info);
		if(msg2.type == "server")
	  {
	            $("#duzydiv").append("</b>");
	  }
	            $("#duzydiv").append("<br>");
	        });
		 });

}
  

var socket = io();

    $.post("/access_game", {}, function(result){
	    	var tk = JSON.parse(result);
	            $("#duzydiv").append( "POŁĄCZONO, WEWNĘTRZNY TOKEN GRY:");
	            $("#duzydiv").append(tk.token);
	            $("#duzydiv").append("<br>");
		    console.log(tk.token);
		    socket.emit('hi', tk.token);
  socket.on('msg', function(msg){
	  var msg2 = JSON.parse(msg);
	  if(msg2.type == "server")
	  {
	            $("#duzydiv").append("<b>");
	  }
	            $("#duzydiv").append(msg2.message.info);
		if(msg2.type == "server")
	  {
	            $("#duzydiv").append("</b>");
	  }
	            $("#duzydiv").append("<br>");
	        });
		        });
*/
