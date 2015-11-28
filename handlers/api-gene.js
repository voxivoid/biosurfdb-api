"use strict";
var joi = require("joi");
var validate = require("express-joi-validator");

var handlers = module.exports = [];

handlers.push(validate({
	params: {
		geneId: joi.string().regex(/GI:[0-9]*/)
	}
}));

handlers.push(
	function (err, req, res, next) {
		if(err.isBoom){
			console.log(err.isBoom);
			res.send("Deu erro");
		}
	}

);

handlers.push(function(req, res, next){
	req.app.connection.execute("select * from gene where gene_ncbi like :geneId", { geneId: req.params.geneId }, function(err, rows) {
		if (err) return next(err);
		res.send(rows);
	});
});