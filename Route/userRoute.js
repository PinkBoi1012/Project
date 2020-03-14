const express = require("express");
const route = express.Router();
const moment = require("moment");
const UserController = require("../Controller/user.controller");
const User = require("../models/User");
const userAuth = require("../middlewares/Authentication.user");
// validate register user

//@route    POST  /
//@desc     render login from
//@access   Public
route.get("/login", userAuth.checkHasLogin, UserController.renderLogin);

//@route    POST  /
//@desc     get data login form
//@access   Public
route.post("/login", UserController.login);

//@route    get /
//@desc     get user main page
//@access   Public
route.get("/", userAuth.checkAuthLogin, UserController.renderAdminMainPage);

//@route    GET /resigter
//@desc     get user main page
//@access   Public
route.get(
  "/register",
  userAuth.checkHasLogin,
  UserController.renderAdminRegisterPage
);

route.post("/register", UserController.register);

route.get("/forgot", function(req, res) {
  res.render("admin/forgot");
});
//@route    Post /active
//@desc     Active User Account
//@access   Private
route.get("/active/:_id", UserController.getActiveUserToken);

module.exports = route;
