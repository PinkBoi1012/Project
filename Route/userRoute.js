const express = require("express");
const route = express.Router();
const moment = require("moment");
const UserController = require("../Controller/user.controller");
const User = require("../models/User");
const userAuth = require("../middlewares/Authentication.user");
// validate register user

//@route    GET  /
//@desc     render login from
//@access   Public
route.get("/login", userAuth.checkHasLogin, UserController.renderLogin);

//@route    POST  /
//@desc     render login from
//@access   Public
route.get("/", userAuth.checkAuthLogin, UserController.renderLogin);
//@route    POST  /
//@desc     get data login form
//@access   Public
route.post("/login", UserController.login);

//@route    get /
//@desc     Render dashboard page
//@access   Public
route.get(
  "/dashboard",
  userAuth.checkAuthLogin,
  UserController.renderAdminMainPage
);

//@route    GET /resigter
//@desc     get user main page
//@access   Public
route.get(
  "/register",
  userAuth.checkHasLogin,
  UserController.renderAdminRegisterPage
);

route.post("/register", UserController.register);

route.get(
  "/forgot",

  UserController.renderForgetPasswordPage
);

//@route    Post /active
//@desc     Active User Account
//@access   Private
route.get(
  "/active/:_id",

  UserController.getActiveUserToken
);

//@route    POST
//@desc     Send link to mail to reset password
//@access   Public
route.post("/forgot", UserController.sentForgotUserPassword);

//@route    GET
//@desc     Change password
//@access   private
route.get("/resetpassword/:_id", UserController.renderResetPasswordPage);

//@route    GET
//@desc     Change password
//@access   private
route.get("/resetpassword/:_id", UserController.renderResetPasswordPage);

//@route  GET
//@desc   Render Product Type Page
//@access Private
route.get(
  "/producttype",
  userAuth.checkAuthLogin,
  UserController.renderAdminProductTypePage
);

//@route  GET
//@desc   Render Product  Page
//@access Private
route.get(
  "/product",
  userAuth.checkAuthLogin,
  UserController.renderAdminProductPage
);

//@route  GET
//@desc   Render Order  Page
//@access Private
route.get(
  "/order",
  userAuth.checkAuthLogin,
  UserController.renderOrderManagerPage
);

//@route  GET
//@desc   Render Customer  Page
//@access Private
route.get(
  "/customer",
  userAuth.checkAuthLogin,
  UserController.renderCustomerManagerPage
);

//@route  GET
//@desc   Render Add Product type  Page
//@access Private
route.get(
  "/addProductType",
  userAuth.checkAuthLogin,
  UserController.renderAddProductPage
);

//@route  POST
//@desc   POST Product type  Page
//@access Private
route.post(
  "/addProductType",
  userAuth.checkAuthLogin,
  UserController.addProductType
);

//@route  GET /user/productTypeInfo/:_id
//@desc   Render Product type info Page
//@access Private
route.get(
  "/productTypeInfo/:_id",
  userAuth.checkAuthLogin,
  UserController.renderProductTypeInfo
);
//@route  PUT /user/edit
//@desc   Update Product Type
//@access Private
route.post(
  "/editProductType",
  userAuth.checkAuthLogin,
  UserController.editProductType
);
//@route  Post /user/deleteProduct/:_id
//@desc   DELETE
//@access Private
route.get(
  "/productTypeDelete/:_id",
  userAuth.checkAuthLogin,
  UserController.deleteProductType
);

module.exports = route;
