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
};

var master;

var Room = function()
{
	this.l1 = '';
	this.l2 = '';
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
		master.send_message(this, seat_id, {"type" : "server", "info": "Witamy, poczekaj na przeciwnika"});
	}
	if(seat_id==1)
	{
		this.l2 = login;
		console.log("wreszcie drugi user");
		master.send_message(this, 1, {"type" : "server", "info": "Witamy, twój przeciwnik ma login "+this.l1});
		master.send_message(this, 0, {"type" : "server", "info": "Witamy, twój przeciwnik ma login "+login});
	}
}

Room.prototype.bye_user = function(seat_id)
{
	master.send_message(this, (seat_id+1)%2, {"type" : "server", "info": "Twój przeciwnik uciekł. bardzo nam przykro"});
}