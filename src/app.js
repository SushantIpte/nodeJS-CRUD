var mysql = require('my-sql');
var config = require('./config/config');
var express = require("express");
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();

app.use('/images', express.static(__dirname + '/views/images'));
app.use('/js', express.static(__dirname + '/views/js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
	saveFileName: true,
	preserveExtension: true,
	abortOnLimit: true,
}));

var con = mysql.createConnection(config.dbConfig)

con.connect((err) => {
	if (err) throw err;
	console.log("Connected!");
});

routes(app, con);

function ExecQuery(query, res) {
	con.query(query, function (err, result, fields) {
		if (err)
			res.status(400).send(err);
		else
			res.redirect('/');
	});
}