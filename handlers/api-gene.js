"use strict";
var joi = require("joi");
var validate = require("express-joi-validator");

var handlers = module.exports = [];

handlers.push(validate({
	query: {
		id: joi.string().regex(/gi:[0-9]+/i)
	}
}));

handlers.push(function (err, req, res, next) {
		var error = {error: ""};
		if (err.isBoom) {
			if (err.data[0].path === "query.id"){
				error.error = "Invalid id. It must be in the GI:<number> format.";
				res.send(error);
			}
		}
		else {
			next(err);
		}
	}
);

handlers.push(function(req, res, next) {
	req.app.connection.execute("select * from gene where gene_ncbi like :id", { id: req.query.id }, function(err, rows) {
		if (err) return next(err);
		if (rows.length < 1) {
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
			error.error = "Gene " + req.params.geneId + " was not found.";
		}
		res.send(error);
	}
});
