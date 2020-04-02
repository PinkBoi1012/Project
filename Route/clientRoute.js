const express = require("express");
const route = express.Router();
const clientRoute = require("../Controller/client.controller");
// @Route   GET /
// @Des     Render HomePage
// @Access  Public
route.get("/", clientRoute.renderHome);
// @Route   GET /
// @Des     Add to Cart
// @Access  Public
route.get("/add-to-cart/:_id", clientRoute.addToCart);
module.exports = route;
