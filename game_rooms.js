"use strict";
module.exports = {
	new_message : function(room, seat_id, message) {
		room.onNewMessageFromClient(seat_id, message);
	},
	new_user : function(room, seat_id, login) {
		room.onNewUser(seat_id, login);
	},
	bye_user : function(room, seat_id) {
		room.onUserExit(seat_id);
	},
	create_room : function(master) {
		return new Room(master);
	}
};

var Room = function(m)
{
	this.sended_messages_container1 = [];
	this.sended_messages_container2 = [];
	this.l1 = '';
	this.l2 = '';
	this.master = m;
}

Room.prototype.send_message_core = function(seat_id, message)
{
	if(seat_id == 0)
	{
		this.sended_messages_container1[this.sended_messages_container1.length] = message;
	}
	else
	{
		this.sended_messages_container2[this.sended_messages_container1.length] = message;
	}
	this.master.send_message(this, seat_id, message);
}

Room.prototype.onNewMessageFromClient = function(seat_id, message)
{
	console.log("xyz" + message.foo);
	this.master.send_message(this, (seat_id+1)%2, {"type" : "user", "info": message.foo});
}

Room.prototype.onNewUser = function(seat_id, login)
{
	if(seat_id==0)
	{
		this.l1 = login;
		this.send_message_core(seat_id, {"type" : "server", "info": "Witamy, poczekaj na przeciwnika"});
	}
	if(seat_id==1)
	{
		this.l2 = login;
		console.log("wreszcie drugi user");
		this.send_message_core(1, {"type" : "server", "info": "Witamy, twój przeciwnik ma login "+this.l1});
		this.send_message_core(0, {"type" : "server", "info": "Witamy, twój przeciwnik ma login "+login});
	}
}

Room.prototype.onUserExit = function(seat_id)
{
	console.log("bye recived");
	this.master.send_message(this, (seat_id+1)%2, {"type" : "server", "info": "Twój przeciwnik uciekł. bardzo nam przykro"});
}
