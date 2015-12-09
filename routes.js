"use strict";

module.exports = function (app) {

	var handlers = require("require-dir")("./handlers");

	app.get("/api/gene/", handlers["api-gene"]);
	app.get("/api/protein/", handlers["api-protein"]);
	app.get("/api/pathway/", handlers["api-pathway"]);

}