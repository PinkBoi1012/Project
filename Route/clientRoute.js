const express = require("express");
const route = express.Router();
const clientRoute = require("../Controller/client.controller");

// @Route   GET /
// @Des     Render HomePage
// @Access  Public
route.get("/", clientRoute.renderHome);
// @Route   GET /
// @Des     Render Login customer
// @Access  Public
route.get("/login", clientRoute.renderLogin);

// Render REgister
route.get("/register", clientRoute.renderRegister);
// Render Forgot password
route.get("/forgotPassword", clientRoute.renderForgotPassword);
// @Route   POST /customer/login
// @Des     Login handle
// @Access  Public
route.post("/customer/login", clientRoute.handleLogin);

// @Route   GET /
// @Des     Add to Cart
// @Access  Public
route.get("/add-to-cart/:_id", clientRoute.addToCart);

route.post("/add-to-cart/:_id", clientRoute.addToCart);
// @Route   GET /
// @Des     minusOne
// @Access  Public
route.get("/minusOne/:_id", clientRoute.minusOne);
// @Route   GET /
// @Des     PlusOne
// @Access  Public
route.get("/plusOne/:_id", clientRoute.plusOne);

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

route.get("/checkout", clientRoute.rendercheckOut);
route.get("/checkout", clientRoute.checkOut);
//Delete item cart
route.get("/deleteItemCart/:_id", clientRoute.deleteItemCart);
//Payment

route.post("/payment", clientRoute.payment);
module.exports = route;
