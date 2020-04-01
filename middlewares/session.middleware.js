module.exports = function(req, res, next) {
  if (!req.signedCookies.sessionId) {
    res.cookie("sessionId", "ABCSD");
  }
  next();
};
