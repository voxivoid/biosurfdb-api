"use strict";

module.exports = function (app) {

	var handlers = require("require-dir")("./handlers");

	console.log(handlers);

	app.get("/api/gene/:geneId", handlers["api-gene"]);
}