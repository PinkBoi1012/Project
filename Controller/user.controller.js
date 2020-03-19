const bcrypt = require("bcryptjs");
const resigterValidate = require("../Validate/user/validate.userRegister");
const loginValidate = require("../Validate/user/validate.userLogin");
const forgetPasswordValidate = require("../Validate/user/validate.userForgot");
const userController = {};
const User = require("../models/User");
const sendMail = require("../middlewares/nodemailer.userActive");
const productType = require("../models/TypeProduct");
const jwt = require("jsonwebtoken");
const key = require("../config/keys");
const addProductTypeValidate = require("../Validate/user/validate.addProductType");

// Render login Page
userController.renderLogin = function(req, res) {
  return res.render("admin/login");
};
// Render forgot password page
userController.renderForgetPasswordPage = function(req, res) {
  res.render("admin/forgot");
  return;
};

// Render Admin register Page
userController.renderAdminRegisterPage = function(req, res) {
  return res.render("admin/register");
};
// Render reset password Page
userController.renderResetPasswordPage = function(req, res) {
  return res.render("admin/resetpassword");
};
// Render Admin page
userController.renderAdminMainPage = function(req, res) {
  return res.render("admin/dashboard");
};

//Render Admin product type page
userController.renderAdminProductTypePage = async function(req, res) {
  let dataProductType = await productType.find();
  res.render("admin/productTypeManage", { dataProductType });
  return;
};
// Render mangager product page
userController.renderAdminProductPage = function(req, res) {
  res.render("admin/productManager");
  return;
};

//render order manager page
userController.renderOrderManagerPage = function(req, res) {
  res.render("admin/orderManager");
  return;
};
//render customer manager page
userController.renderCustomerManagerPage = function(req, res) {
  res.render("admin/customerManager");
  return;
};

//render Add product page
userController.renderAddProductPage = function(req, res) {
  res.render("admin/addProductType");
  return;
};

//render Product Type Information
userController.renderProductTypeInfo = async function(req, res) {
  let data = await productType.findById(req.params._id);
  if (!data) {
    return res.redirect("/user/producttype");
  }
  res.render("admin/updateProductType", { data });
  return;
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
          errors.email =
            "Please contact to pinkfoxstoredemo@gmail.com to active the account";
          res.render("admin/login", { errors, values: req.body });
          return;
        }
        if (!bcrypt.compareSync(req.body.password, data.password)) {
          errors.password = "Wrong password";
          res.render("admin/login", { errors, values: req.body });
          return;
        }

        res.cookie("user", data.id, {
          signed: true,
          expires: new Date(Date.now() + 8 * 3600000)
        });
        res.redirect("/user/dashboard");

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
    let content =
      "<p>Please Click This Link To Active Admin Account:</p><a href=http://localhost:8080/user/active/" +
      token +
      ">Link";
    await sendMail(
      "pinkfoxstoredemo@gmail.com",
      "Active Amin Account Store",
      content
    );
    res.redirect("/user/login");
    return;
  });
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
    User.findById(decoded._id, function(err, data1) {
      if (data1.active == false) {
        User.findByIdAndUpdate(decoded._id, { active: true }, function(
          err,
          data
        ) {
          res.send("Account " + data.email + " is Activate.");
          let content = "<p>Account is active </p>";
          sendMail(data1.email, "Active Admin Account Store", content);
          return;
        });
        return;
      }
      res.send("Account is already active Activate.");
      return;
    });
  });
};
// Sent Forgot password, send Mail
userController.sentForgotUserPassword = async function(req, res) {
  const { errors, isValid } = forgetPasswordValidate(req.body);
  if (!isValid) {
    res.render("admin/forgot", { errors, values: req.body });
    return;
  }
  let findUser = await User.findOne({ email: req.body.email });
  if (!findUser) {
    errors.email = "Email is not exist Please input again";
    res.render("admin/forgot", { errors, values: req.body });
    return;
  }
  let token = await jwt.sign({ _id: findUser._id }, key.secret, {
    expiresIn: "24h"
  });
  let subject = `Recovery Account ${findUser.email}`;
  let content =
    "<p>Please Click This Link To reset password Admin Account:</p><a href=http://localhost:8080/user/resetpassword/" +
    token +
    ">Link";
  sendMail(req.body.email, subject, content);
  return;
};

// Submit new Product Type
userController.addProductType = async function(req, res) {
  const { errors, isValid } = addProductTypeValidate(req.body);
  let isNameExist = await productType.findOne({ TP_name: req.body.TP_name });
  if (isNameExist) {
    // send
    errors.TP_name = "This Product Type is exist";
    res.render("admin/addProductType", { errors, values: req.body });
    return;
  }
  if (!isValid) {
    res.render("admin/addProductType", { errors, values: req.body });
    return;
  }
  let newProductType = new productType({
    TP_name: req.body.TP_name,
    TP_description: req.body.TP_description
  });
  // Add product type and save turn back to product type page
  newProductType.save(function(err, data) {
    return res.redirect("producttype");
  });
};

userController.editProductType = async function(req, res) {
  const { errors, isValid } = addProductTypeValidate(req.body);
  console.log;
  let data = await productType.findOne({ TP_name: req.body.TP_name });

  if (data) {
    errors.TP_name = "This Product Type is exist";
    res.render("admin/updateProductType", { data, errors });
    return;
  }

  let change = {
    TP_name: req.body.TP_name,
    TP_description: req.body.TP_description
  };

  productType.findByIdAndUpdate(req.body._id, change, function(err, data) {
    if (err) {
      return console.log(err);
    }
    res.redirect("producttype");
    return;
  });
};

userController.deleteProductType = async function(req, res) {
  productType.findByIdAndRemove(req.params._id, function(err, data) {
    res.redirect("/user/producttype");
    return;
  });
};
module.exports = userController;
