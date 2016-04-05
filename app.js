"use strict";

var game_rooms = require('./game_rooms');

var swig  = require('swig');
var md5  = require('md5');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var pgp = require("pg-promise")({});
var randomstring = require("randomstring");
var http = require('http').Server(app);
var io = require('socket.io')(http);

var cn = {
    host: 'localhost', // server name or IP address;
    port: 5432,
    database: 'heroes',
    user: 'postgres',
    password: 'postgres'
};

var db = pgp(cn);

app.use(cookieParser());
app.use(express.static('public'));
var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/registration', function (req, res) {
var swig5 = swig.renderFile('templates/registration.html', {});
res.send(swig5);
});
app.get('/login', function (req, res) {
var swig5 = swig.renderFile('templates/login.html', {});
res.send(swig5);
});

app.get('/game', function (req, res) {
var swig5 = swig.renderFile('templates/game.html', {});
res.send(swig5);
});


app.get('/', function (req, res) {
	var token = req.cookies.heroes_session;
	if(token==undefined)
	{
		var swig5 = swig.renderFile('templates/index.html');
		res.send(swig5);
	}
	db.oneOrNone("select login from session where token=$1", [token])
	.then(function(data){
		var login = data.login;
if(login==null)
{
	var swig5 = swig.renderFile('templates/index.html');
	res.send(swig5);
}
else
{
var swig5 = swig.renderFile('templates/index_logged.html', {login: login});
res.send(swig5);
}
	});
});



app.post('/login_send', function (req, res) {
	var token = randomstring.generate(32);
	var login = req.body.login;
	var pass = md5(req.body.password);
	db.any("select * from user2 where login=$1 and password=$2", [login, pass])
	    .then(function (data) {
		    		if(data.length>0)
				{
					db.none("insert into session(login, token) values($1, $2)", [login, token])
					  .then(function () {
					res.cookie("heroes_session", token);
			    		res.send("ok");
					})
				    .catch(function (error) {
					console.log(error)
    					res.send("ccc");
					});
				}
				else
				{
					res.send('aaa');
				}
			        })
	        .catch(function (error) {
					res.send('bbb');
				    });
});


app.post('/registarion_send', function(req, res) {
console.log("witam z registarion send");
console.log(md5(req.body.password));

db.none("insert into user2(login, password) values($1, $2)", [req.body.login, md5(req.body.password)])
    .then(function () {
    		res.send("ok");
	})
    .catch(function (error) {
		console.log(error)
    		res.send("error xD");
	});
});


var rooms = [];
var token_map = {};

var master = {
	send_message : function(room, seat_id, message)
	{
		//najbardziej gówniana implementacja z możliwych
		var message_id = 0;
		console.log("sm sm sm");
		for(var x = 0; x<rooms.length; x++)
		{
			if(rooms[x].room_data==room)
			{
				if(seat_id==0)
				{
					console.log("PRÓBA WYSŁANIA DO 0 ROOM "+rooms[x].token0);
					io.to(rooms[x].token0).emit('msg', JSON.stringify({id : message_id, message : message}));
				}
				else
				{
					console.log("PRÓBA WYSŁANIA DO 1 ROOM "+rooms[x].token1);
					io.to(rooms[x].token1).emit('msg', JSON.stringify({id : message_id, message : message}));
				}
			}
		}
	}
};

function find_room(akt_user, akt_token)
{
	for(var i = 0; i<rooms.length; i++)
	{
		var obj = rooms[i];
		if(obj.room_data != null && obj.usr1=="" && obj.usr0!=akt_user)
		{
			console.log("abc");
			obj.usr1 = akt_user;
			obj.token1 = akt_token;
			return {"obj": obj, "seat" : 1, "registred" : false, "user" : akt_user};
		}
	}
	var obj_then = {usr0 : akt_user, token0 : akt_token, usr1: "", token1 : "", room_data : game_rooms.create_room(master)};
	rooms[rooms.length] = obj_then;
	return {"obj": obj_then, "seat": 0, "registred" : false, "user" : akt_user};	
}

function clear_user(token)
{
	if(token_map[token] != undefined)
	{
		game_rooms.bye_user(token_map[token].obj.room_data, token_map[token].seat);
		delete token_map[token];
		return true;
	}
	return false;	
}

function access_game_login(login, res)
{
	console.log("running xDD");
	var newtoken = randomstring.generate(18);
	console.log("running xD");
	var obj = find_room(login, newtoken);
	console.log("running");
	console.log(newtoken);
	console.log(obj);
	token_map[newtoken] = obj;
	console.log(rooms.length);
	return JSON.stringify({"token" : newtoken});
}

app.post('/access_game', function (req, res) {

var token = req.cookies.heroes_session;
	if(token==undefined)
	{
		res.end(JSON.stringify({"token" : null}));
	}
	db.oneOrNone("select login from session where token=$1", [token])
	.then(function(data){
		var login = data.login;
		console.log(login);
		if(login==null)
		{
			res.end(JSON.stringify({"token" : null}));
		}
		else
		{
			var rr = access_game_login(login, res);
			console.log(rr);
			res.end(rr);
		}
	});
});

io.on('connection', function(socket){
	console.log("user connect");
			socket.on('hi', function(msg){
			socket.token = msg;
			var obj = token_map[msg];
			console.log("NOWY USER XD "+msg);
			socket.join(msg);
				if(!obj.registred)
				{
					obj.registred = true;
					game_rooms.new_user(obj.obj.room_data, obj.seat, obj.user); 							
				}
			});
	  socket.on('msg2', function(msg){
				console.log(msg);
		        var msg2 = msg;
//JSON.parse(msg);
				console.log(msg2);
			var token = token_map[msg2.token];
			if(token && token.obj)
			{
				if(token.obj.token0 == msg2.token)
					game_rooms.new_message(token.obj.room_data, 0, msg2.message);
				if(token.obj.token1 == msg2.token)
					game_rooms.new_message(token.obj.room_data, 1, msg2.message);
			}
			});
	socket.on('bye', function(msg){
		        var msg2 = JSON.parse(msg);
			clear_user(msg2.token);
			});
socket.on('disconnect', function(){
    console.log(socket.token);
		var token = token_map[socket.token];
		if(token && token.obj)
			{
				if(token.obj.token0 == socket.token)
					game_rooms.bye_user(token.obj.room_data, 0);
				if(token.obj.token1 == socket.token)
					game_rooms.bye_user(token.obj.room_data, 1);
			}
	});

});


http.listen(9999, function () {
});


