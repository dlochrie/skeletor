module.exports = function(app) {
  var passport = require('passport')
    , GoogleStrategy = require('passport-google').Strategy
    , User = require('../app/models/user')
    , url = 'http://' + app.get('host') + ':' + app.get('port');

  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete Google profile is serialized
  //   and deserialized.
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // Use the GoogleStrategy within Passport.
  passport.use(new GoogleStrategy({
      returnURL:  url + '/auth/google/return',
      realm: url + '/'
    },
    function(identifier, profile, done) {
      var resource = {
        displayName: profile.displayName,
        google_id: identifier,
        email: profile.emails[0].value
      }
      var model = new User(app, null);
      model.find({where: {email: resource.email}}, function(err, user) {
        user = (user.length) ? user[0] : null;
        if (user) return done(null, user);
        if (err || !user) {
          model.create({values: resource}, function(err, user) {
            if (user) return done(null, user[0]);
            return done(err, null);
          });
        }
      });
    }
  ));
  
  app.get('/auth/google', passport.authenticate('google'));
  
  app.get('/auth/google/return', passport.authenticate('google', 
      {failureRedirect: '/login'}),
    function(req, res) {
      var session = req.session;
      if (session.passport.user) {
        session.logged_in = true;
      }
      res.redirect('/');
    });

  app.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/');
  });
}