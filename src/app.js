var mysql = require('my-sql');
var config = require('./config/config');
var express = require("express");
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

function startScript() {
	var app = express();

	app.use('/images', express.static(__dirname + '/views/images'));
	app.use('/js', express.static(__dirname + '/views/js'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(fileUpload({
		saveFileName: true,
		preserveExtension: true,
		abortOnLimit: true,
	}));

	var con = mysql.createConnection(config.dbConfig)

	con.connect((err) => {
		if (err) throw err;
		console.log("Connected!");
		routes(app, con);
	});
}

module.exports = {
	startScript
}
