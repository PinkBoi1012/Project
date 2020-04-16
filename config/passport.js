const passport = require("passport");
const customer = require("../models/Customer");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  customer.findById(id, function (err, daa) {
    done(err, data);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      customer.findOne({ email: email });
    }
  )
);
