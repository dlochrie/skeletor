exports.initialize = function(req, res) {
  var self = this,
    session = req.session,
    locals = req.app.locals;

  if (session.user) {
    req.app.locals.user = session.user;
    return;
  }

  req.app.locals.user = false;
  session.user = false;

  if (session.passport.user) {
    req.app.locals.user = session.passport.user;
    
    //c.User.find(session.passport.user, function (err, user) {
    /*
      if (!err || user) {
        session.user = {
          name: user.displayName,
          email: user.email,
          owner: checkOwner(user.email),
          id: user.id
        }
        locals.user = session.user;
        c.next();
      }
    */
    //}.bind(self));
  } else {
    return;
  }
}