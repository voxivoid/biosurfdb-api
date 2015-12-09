"use strict";
var joi = require("joi");
var validate = require("express-joi-validator");

var handlers = module.exports = [];

handlers.push(function(req, res, next) {
	req.app.connection.execute("select * from pathway_simple where pathway_id like :id", { id: req.query.id }, function(err, rows) {
		if (err) return next(err);
		if (rows.length < 1) {
			console.log(rows);
			req.isEmpty = true;
		}
		else {
			req.result = rows;
		}
		next();		
	});
});

handlers.push(function(req, res, next) {
	if (req.result) {
		res.send(req.result);		
	}
	else {
		var error = {error: ""};
		if (req.isEmpty) {
			error.error = "Pathway " + req.query.id + " was not found.";
		}
		res.send(error);
	}
});
