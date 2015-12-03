"use strict";

module.exports = function (app) {

	var handlers = require("require-dir")("./handlers");

	app.get("/api/gene/:geneId", handlers["api-gene"]);
	app.get("/api/protein/:proteinId", handlers["api-protein"]);
}