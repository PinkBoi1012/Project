const User = require("../models/User");
const userAuth = {};
// Check cookie

userAuth.checkAuthLogin = function (req, res, next) {
  if (!req.signedCookies.user) {
    res.redirect("/user/login");
    return;
  }

  User.findById(req.signedCookies.user).then(function (data) {
    if (!data) {
      res.redirect("/user/login");
      return;
    }
    res.locals.user = data;
    next();
  });
};

userAuth.checkHasLogin = function (req, res, next) {
  if (req.signedCookies.user) {
    res.redirect("/user/dashboard");
    return;
  }
  next();
};
module.exports = userAuth;
