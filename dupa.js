var swig  = require('swig');
var md5  = require('md5');
var express = require('express');
var app = express();
var pgp = require("pg-promise")({});

var cn = {
    host: 'localhost', // server name or IP address;
    port: 5432,
    database: 'heroes',
    user: 'postgres',
    password: 'postgres'
};

var db = pgp(cn);

app.use(express.static('public'));
var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.get('/registration', function (req, res) {
var swig5 = swig.renderFile('test.html', {});
res.send(swig5);
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var rooms = [];
var token_map = {};

function find_room(akt_user, akt_token)
{
	for(it in rooms)
	{
		var obj = rooms[it];
		if(obj.room_data != null && obj.usr1=="" && obj.usr0!=akt_user)
		{
			obj.usr1 = akt_user;
			obj.token1 = akt_token;
			//TODO APPEND
			return {"obj": obj, "seat" : 1};
		}
	}
	//TODO CREATE ROOM
	var obj_then = {usr0 : akt_user, token0 : akt_token, usr1: "", token1 : "", room_data : null};
	rooms[rooms.length] = obj_then;
	//TODO APPEND
	return {"obj": obj_then, "seat": 0};	
}

function clear_user(token)
{
	if(token_map[token] != undefined)
	{
		//TODO NOTIFY BYE-BYE
		delete token_map[token];
		return true;
	}
	return false;	
}

var randomstring = require("randomstring");


//EXAMPLE ROOM

var Room = function(pare)
{
	this.par = pare;
}

Room.pr


//END OF EXAMPLE ROOM


app.post('/access_game', function (req, res) {
	var login = req.body.login;
	var newtoken = randomstring.generate(18);
	var obj = find_room(login, newtoken);
	tokenmap[newtoken] = obj;
	console.log(obj);
	console.log(rooms.length);
	res.end(JSON.stringify({"token" : newtoken}));
});

app.post('/registarion_send', function(req, res) {
console.log("witam z registarion send");
console.log(req.body);
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
