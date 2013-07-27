exports.initialize = function(req, res) {
  var self = this,
    session = req.session;

  if (session.passport.user) {
    session.user = session.passport.user;
    return;
  }
}