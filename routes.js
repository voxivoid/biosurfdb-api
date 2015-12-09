"use strict";

module.exports = function (app) {

	var handlers = require("require-dir")("./handlers");

	app.get("/~biosurfdb/api/gene/", handlers["api-gene"]);
	app.get("/~biosurfdb/api/protein/", handlers["api-protein"]);
	app.get("/~biosurfdb/api/pathway/", handlers["api-pathway"]);

}