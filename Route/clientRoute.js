const express = require("express");
const route = express.Router();
const clientRoute = require("../Controller/client.controller");
// @Route   GET /
// @Des     Render HomePage
// @Access  Public
route.get("/", clientRoute.renderHome);

module.exports = route;
