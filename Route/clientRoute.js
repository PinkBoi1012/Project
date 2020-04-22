const express = require("express");
const route = express.Router();
const clientRoute = require("../Controller/client.controller");
const csrf = require("csurf");
const csrfProtection = csrf();
const check = require("../middlewares/Authentication.customer");
route.use(csrfProtection);
// @Route   GET /
// @Des     Render HomePage
// @Access  Public
route.get("/", clientRoute.renderHome);
// @Route   GET /
// @Des     Render Login customer
// @Access  Public
route.get("/login", check.checkAuthLogin, clientRoute.renderLogin);
// logout
route.get("/logout", clientRoute.handleLogout);
// Render REgister
route.get("/register", check.checkAuthLogin, clientRoute.renderRegister);
// Render Forgot password
route.get(
  "/forgotPassword",
  check.checkAuthLogin,
  clientRoute.renderForgotPassword
);
//render customer info
route.get(
  "/customer/info",
  check.checkLogin,
  clientRoute.renderCusInfo_accountInfo
);
//render reset forget password
route.get("/customer/resetpassword/:id", clientRoute.renderResetPasswordPage);
// render order manager
route.get(
  "/customer/orderManager",
  check.checkLogin,
  clientRoute.renderCusInfo_orderManager
);
//render order view Detail
route.get(
  "/order/view/:_id",
  check.checkLogin,
  clientRoute.renderCusInfo_detailOrderView
);
// render CHange password
route.get(
  "/customer/changepass",
  check.checkLogin,
  clientRoute.renderCusInfo_changePass
);
// handle reset forget password
route.post("/customer/resetPassword", clientRoute.resetForgetPassword);
//handle send token forgot password
route.post("/customer/forgot", clientRoute.handleSendForgotPassword);
// handle change password
route.post(
  "/customer/changePass",
  check.checkLogin,
  clientRoute.handleChangePass
);
// @Route   POST /customer/login
// @Des     Login handle
// @Access  Public
route.post("/login", clientRoute.handleLogin);
// render show order

// POST /register
// Handle customer register
// access Public

route.post("/register", clientRoute.handleRegister);
// handle change customer information (full name and number phone)
route.post(
  "/customer/changeInfo",
  check.checkLogin,
  clientRoute.handleChangeCustomerInfo
);
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
// render checkout
route.get("/checkout", check.checkHasLoginPayment, clientRoute.rendercheckOut);

//Delete item cart
route.get("/deleteItemCart/:_id", clientRoute.deleteItemCart);
//Payment

route.post("/payment", clientRoute.payment);
module.exports = route;
