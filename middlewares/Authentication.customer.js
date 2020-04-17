const customer = require("../models/Customer");
const customerAuth = {};
// Check cookie

customerAuth.checkAuthLogin = function (req, res, next) {
  if (!req.session.customer) {
    next();
    return;
  }

  customer.findById(req.session.customer._id).then(function (data) {
    if (!data) {
      res.render("./client/login", { csrfToken: req.csrfToken() });
      return;
    }
    res.redirect("/");
  });
};

customerAuth.checkHasLoginPayment = function (req, res, next) {
  if (req.session.customer == null) {
    res.render("./client/login", { csrfToken: req.csrfToken() });
    return;
  }
  customer.findById(req.session.customer._id).then(function (data) {
    if (!data) {
      res.render("./client/login", { csrfToken: req.csrfToken() });
      return;
    }
  });
  next();
};
module.exports = customerAuth;
