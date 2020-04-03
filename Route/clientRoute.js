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

// @Route   GET /
// @Des     Product Info
// @Access  Public
route.get("/product/:_id", clientRoute.renderProductInfo);

module.exports = route;
