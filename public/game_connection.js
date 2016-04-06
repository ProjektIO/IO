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
GameConnection.prototype.send = function(msg)
{
	this.socket.emit('msg2', {"token" : this.token, "message" : {foo : msg}});
}
GameConnection.prototype.resign = function()
{
	this.socket.emit('bye', {"token" : this.token});
}


