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

route.post("/add-to-cart/:_id", clientRoute.addToCart);
// @Route   GET /
// @Des     Add to Cart
// @Access  Public
route.get("/minusOne/:_id", clientRoute.minusOne);
// @Route   GET / /productInfo/:_id
// @Des     Product Info
// @Access  Public
route.get("/productInfo/:_id", clientRoute.renderProductInfo);
// @Route   POST /productInfo/:_id
// @Des     Add cart in product info
// @Access  Public
route.post("/productInfo/:_id", clientRoute.addCartProductInfo);
// @Route   GET /cartInfo
// @Des     show cart information
// @Access  Public
route.get("/cartInfo", clientRoute.renderCartInfo);
module.exports = route;
