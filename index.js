"use strict";
 
var config = require("./config")

var express = require("express");
var app = express();
var mysql = require("mysql2");

app.use(require("helmet")());
app.use(require("compression")());
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({extended: true}));

app.connection = mysql.createConnection(config.db);
app.connection.config.namedPlaceholders = true;

require("./routes")(app);

app.use(function (err, req, res, next) {
	if (config.environment !== "development") { // production error handler
		if (!res.headersSent) res.sendStatus(500);
		console.error(err.stack);
	}
	else { // development error handler (default)
		next(err);
	}
});


var server = app.listen(config.port, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Server listening at http://%s:%s", host, port);
});