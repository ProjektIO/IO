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
