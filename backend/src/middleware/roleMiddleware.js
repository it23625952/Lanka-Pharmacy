// placeholder to check permissions on req.user
exports.authorize = (permission) => (req, res, next) => {
  // if user has permission allow
  next();
};
