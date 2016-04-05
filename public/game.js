"use strict";
function GameConnection(handler, existed_token)
{
	this.socket = io();
	this.handler = handler;
	var that = this;
	if(existed_token == undefined)
	{
		$.post("/access_game", {}, function(result){
	    	var tk = JSON.parse(result);
				that.token = tk.token;
				handler.debug("POŁĄCZONO, WEWNĘTRZNY TOKEN GRY:" + that.token);
				that.socket.emit('hi', that.token);
				that.socket.on('msg', function(msg){
				var msg2 = JSON.parse(msg);
				that.handler.new_message(msg2.message);
				});
		});
	}
	else
	{
		that.token = existed_token;
		that.socket.emit('hi', that.token);
				that.socket.on('msg', function(msg){
				var msg2 = JSON.parse(msg);
				that.handler.new_message(msg2.message);
				});

	}
}
GameConnection.prototype.send_message = function(msg)
{
	this.socket.emit('msg2', {"token" : this.token, "message" : {foo : msg}});
}
GameConnection.prototype.bye = function()
{
	this.socket.emit('bye', {"token" : this.token});
}
var game = {
	new_message : function(message)	{
		console.log(message);
		$("#duzydiv").append(message.info);
		$("#duzydiv").append("</br>");
	},
	debug : function(message) {
		$("#duzydiv").append("SYSINFO : ");
		$("#duzydiv").append(message);
		$("#duzydiv").append("</br>");
	}	
}


var connection = new GameConnection(game);

$("#button").click(function(){connection.send_message($("#msg").val())
		$("#msg").empty();
		$("#duzydiv").append("<b>"+$("#msg").val()+"</b>");
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
