const bcrypt = require("bcryptjs");
const resigterValidate = require("../Validate/user/validate.userRegister");
const loginValidate = require("../Validate/user/validate.userLogin");
const userController = {};
const User = require("../models/User");
const sendMail = require("../middlewares/nodemailer.userActive");
const jwt = require("jsonwebtoken");
const key = require("../config/keys");
// Render login Page
userController.renderLogin = function(req, res) {
  res.render("admin/login");
};
// Render forgot password page
userController.forgetPassword = function(req, res) {};

// Render Admin register Page
userController.renderAdminRegisterPage = function(req, res) {
  return res.render("admin/register");
};
// login Admin Function
userController.login = function(req, res) {
  const { errors, isValid } = loginValidate(req.body);
  if (errors) {
    if (!isValid) {
      res.render("admin/login", { errors, values: req.body });

      return;
    }
    User.findOne({ email: req.body.email }).then(function(data) {
      if (data) {
        if (!data.active) {
          errors.email = "Unauthenticated account. Please check your email";
          res.render("admin/login", { errors, values: req.body });
          return;
        }
        if (!bcrypt.compareSync(req.body.password, data.password)) {
          errors.password = "Wrong password";
          res.render("admin/login", { errors, values: req.body });
          return;
        }

        res.cookie("user", data.id, { signed: true });
        res.redirect("/user");

        return;
      }
      errors.email = "Email is not exist";
      res.render("admin/login", { errors, values: req.body });

      return;
    });
  }
};

// register Addmin
userController.register = async function(req, res) {
  const { errors, isValid } = resigterValidate(req.body);

  let userExit = await User.find({ email: req.body.email });

  if (userExit.length > 0) {
    errors.email = "This email is exist";
    res.render("admin/register", { errors, values: req.body });
    return;
  }
  if (!isValid) {
    res.render("admin/register", { errors, values: req.body });

    return;
  }
  let salt = bcrypt.genSaltSync(10);
  var password = bcrypt.hashSync(req.body.password, salt);
  let user = new User({
    email: req.body.email,
    fullname: req.body.fullname,
    password,
    phone: req.body.phone
  });

  user.save(async function(err, userData) {
    let token = await jwt.sign({ _id: userData._id }, key.secret, {
      expiresIn: "24h"
    });
    await sendMail(userData.email, "Active Amin Account Store", token);
    res.redirect("/user/login");
    return;
  });
};
// Render Admin page
userController.renderAdminMainPage = function(req, res) {
  let userCookies = req.cookies;
  return res.render("admin/admin", { userCookies });
};

// Active user Account
userController.getActiveUserToken = function(req, res) {
  jwt.verify(req.params._id, key.secret, function(err, decoded) {
    if (err) {
      res.send(
        "Token is expired.We has send another token, Please check your email again "
      );
      return;
    }
    User.findByIdAndUpdate(decoded._id, { active: true }, function(err, data) {
      res.send(
        "Account is Activate. Go back to User Home <a href='http://localhost:8080/user/login'>Login "
      );
    });
  });
};

module.exports = userController;
