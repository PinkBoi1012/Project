const express = require("express");
const route = express.Router();
const moment = require("moment");
const UserController = require("../Controller/user.controller");
const User = require("../models/User");
//@route    POST  /
//@desc     render login from
//@access   Public
route.get("/login", UserController.renderLogin);

//@route    POST  /
//@desc     get data login form
//@access   Public
route.post("/login", UserController.login);

//@route    get /
//@desc     get user main page
//@access   Public
route.post("/", UserController.renderAdminMainPage);

//@route    POST /resigter
//@desc     get user main page
//@access   Public
route.get("/register", UserController.renderAdminRegisterPage);

route.post("/register", UserController.register);
module.exports = route;
