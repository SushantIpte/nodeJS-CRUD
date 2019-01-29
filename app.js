var express = require("express");
var fileUpload = require('express-fileupload');
var fs = require('fs-extra');
var app = express();
var http = require('http');
var port = 7000;
var mysql = require('my-sql');
var bodyParser = require('body-parser');
// var mongoose = require("mongoose");
var con = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: "test"
})

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
	saveFileName: true,
	preserveExtension: true,
	abortOnLimit: true,
}));

app.post("/api/save", (req, res) => {
	console.log("Submit");
	var dt = new Date();
	if (req.files && req.files.profile) {
		var str = 'images/' + + dt.getTime() + '.' + req.files.profile.name.split('.')[1]
		var query = 'INSERT INTO `Users` (`First`, `Last`, `Email`, `Contact`, `Profile`) VALUES ("' + req.body.First + '","' + req.body.Last + '","' + req.body.Email + '","' + req.body.Contact + '","' + str + '")'
		var sampleFile = req.files.profile;
		sampleFile.mv(str, function (err) {
			if (err)
				return res.status(500).send(err);
		});
		console.log('saved')
	} else {
		var query = 'INSERT INTO `Users` (`First`, `Last`, `Email`, `Contact`) VALUES ("' + req.body.First + '","' + req.body.Last + '","' + req.body.Email + '","' + req.body.Contact + '")'
	}
	ExecQuery(query, res)
});



app.post("/api/edit", (req, res) => {
	var id = req.body._id
	delete req.body._id;
	var img = false
	if (req.files && req.files.profile) {
		var dt = new Date();
		var str = 'images/' + + dt.getTime() + '.' + req.files.profile.name.split('.')[1]
		var sampleFile = req.files.profile;
		sampleFile.mv(str, function (err) {
			if (err)
				return res.status(500).send(err);
		});
		console.log('saved')
		img = true;
	}
	if (img) {
		var query = 'UPDATE `Users` SET `First` = "' + req.body.First + '", `Last` = "' + req.body.Last + '", `Email` = "' + req.body.Email + '", `Contact` = "' + req.body.Contact + '", `Profile` = "' + str + '" WHERE Id=' + id;
	} else {
		var query = 'UPDATE `Users` SET `First` = "' + req.body.First + '", `Last` = "' + req.body.Last + '", `Email` = "' + req.body.Email + '", `Contact` = "' + req.body.Contact + '" WHERE Id=' + id;
	}
	ExecQuery(query, res)
});

app.delete("/api/delete", (req, res) => {
	var query = 'SELECT * FROM `Users` WHERE Id = ' + req.body.prodid;
	con.query(query, function (err, result, fields) {
		if (result && result[0] && result[0].profile) {
			fs.remove(result[0].profile, function (err, res) {
				if (err) {
					console.info(err);
				}
			})
		}
	});

	var query = 'DELETE FROM `Users` WHERE Id = ' + req.body.prodid;
	console.log(query)
	con.query(query, function (err, result, fields) {
		if (err)
			res.send(err);
		else
			res.json({ message: 'Successfully deleted' });
	});
	console.log("Deleted");
});

app.get("/api/get", (req, res) => {
	var query = 'SELECT * FROM `Users`';
	console.log(query)
	con.query(query, function (err, result, fields) {
		if (err) {
			res.status(400).send(err);
			console.log(err)
		}
		else {
			res.send(result);
		}
	});
});


app.listen(port, () => {
	console.log("Server listening on port " + port);
});


app.use("/", (req, res) => {
	console.log('Started');
	res.sendFile(__dirname + "/index.html");
});

function ExecQuery(query, res) {
	con.query(query, function (err, result, fields) {
		if (err)
			res.status(400).send(err);
		else
			res.redirect('/');
	});
}