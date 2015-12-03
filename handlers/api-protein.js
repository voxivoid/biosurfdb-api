"use strict";
var joi = require("joi");
var validate = require("express-joi-validator");

var handlers = module.exports = [];

handlers.push(validate({
	params: {
		proteinId: joi.string().regex(/gi:[0-9]+/i)
	}
}));

handlers.push(function (err, req, res, next) {
		var error = {error: ""};
		if (err.isBoom) {
			if (err.data[0].path === "params.proteinId"){
				error.error = "Invalid proteinId. It must be in the GI:<number> format.";
				res.send(error);
			}
		}
		else {
			next(err);
		}
	}
);

handlers.push(function(req, res, next) {
	req.app.connection.execute("select * from protein where protein_ncbi like :proteinId", { proteinId: req.params.proteinId }, function(err, rows) {
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
			error.error = "Protein " + req.params.proteinId + " was not found.";
		}
		res.send(error);
	}
});
