"use strict";
var joi = require("joi");
var validate = require("express-joi-validator");

var handlers = module.exports = [];

handlers.push(validate({
	params: {
		geneId: joi.string().regex(/gi:[0-9]+/i)
	}
}));

handlers.push(function (err, req, res, next) {
		var error = {error: ""};
		if (err.isBoom) {
			if (err.data[0].path === "params.geneId"){
				error.error = "Invalid geneId. It must be in the GI:<number> format.";
				res.send(error);
			}
		}
		else {
			next(err);
		}
	}
);

handlers.push(function(req, res, next) {
	req.app.connection.execute("select * from gene where gene_ncbi like :geneId", { geneId: req.params.geneId }, function(err, rows) {
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
	if(req.isEmpty) {
		var error = {error: "Gene " + req.params.geneId + " was not found."};
		res.send(error);
	}
	else {
		res.send(req.result);
	}
});
