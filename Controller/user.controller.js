const userController = {};
const User = require("../models/User");

userController.renderLogin = function(req, res) {
  res.render("admin/login");
};

userController.login = function(req, res) {
  User.findOne({ email: req.body.email }).then(function(data) {
    if (data.password == req.body.password) {
      return res.redirect("/");
    }
  });
};

userController.renderAdminMainPage = function(req, res) {
  return res.render("admin/admin");
};

userController.renderAdminRegisterPage = function(req, res) {
  return res.render("admin/register");
};

userController.register = function(req, res) {
  console.log(req.body);
};
module.exports = userController;
