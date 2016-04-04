"use strict";
module.exports = {
	register_master : function(m) {
		master = m;
	},
	new_message : function(room, seat_id, message) {
		room.new_message(seat_id, message);
	},
	new_user : function(room, seat_id, login) {
		room.new_user(seat_id, login);
	},
	bye_user : function(room, seat_id) {
		room.bye_user(seat_id);
	},
	create_room : function() {
		return new Room();
	}
	get_messages : function(room, min, max, seat_id) {
		return room.get_messages(min, max);
	}
};

var master;

var Room = function()
{
	this.sended_messages_container1 = [];
	this.sended_messages_container2 = [];
	this.l1 = '';
	this.l2 = '';
}

Room.prototype.get_messages = function(min, max, seat_id)
{
	var tmp = [];
	if(user == 0)
		for(var i=min; i<=max && i<this.sended_messages_container1.length; i++)
		{
			tmp[tmp.length] = this.sended_messages_container1[i];
		}
	else
		for(var i=min; i<=max && i<this.sended_messages_container2.length; i++)
		{
			tmp[tmp.length] = this.sended_messages_container2[i];
		}
	return tmp;
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
	master.send_message(this, seat_id, message);
}

Room.prototype.new_message = function(seat_id, message)
{
	master.send_message(this, (seat_id+1)%2, {"type" : "user", "info": message});
}

Room.prototype.new_user = function(seat_id, login)
{
	if(seat_id==0)
	{
		this.l1 = login;
		send_message_core(seat_id, {"type" : "server", "info": "Witamy, poczekaj na przeciwnika"});
	}
	if(seat_id==1)
	{
		this.l2 = login;
		console.log("wreszcie drugi user");
		send_message_core(1, {"type" : "server", "info": "Witamy, twój przeciwnik ma login "+this.l1});
		send_message_core(0, {"type" : "server", "info": "Witamy, twój przeciwnik ma login "+login});
	}
}

Room.prototype.bye_user = function(seat_id)
{
	master.send_message(this, (seat_id+1)%2, {"type" : "server", "info": "Twój przeciwnik uciekł. bardzo nam przykro"});
}
