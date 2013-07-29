module.exports = function(app) {
  var passport = require('passport')
    , GoogleStrategy = require('passport-google').Strategy
    , User = require('../app/models/user');

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
      returnURL: 'http://localhost:3000/auth/google/return',
      realm: 'http://localhost:3000/'
    },
    function(identifier, profile, done) {
      var resource = {
        displayName: profile.displayName,
        google_id: identifier,
        email: profile.emails[0].value
      }
      var model = new User(app, resource);
      model.find({email: resource.email}, function(err, user) {
        if (user) return done(null, user);
        if (err || !user) {
          model.create(function(err, user) {
            done(err, null);
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