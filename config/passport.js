module.exports = function(app) {
  var passport = require('passport')
    , GoogleStrategy = require('passport-google').Strategy;

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
  //   Strategies in passport require a `validate` function, which accept
  //   credentials (in this case, an OpenID identifier and profile), and invoke a
  //   callback with a user object.
  passport.use(new GoogleStrategy({
      returnURL: 'http://localhost:3000/auth/google/return',
      realm: 'http://localhost:3000/'
    },
    function(identifier, profile, done) {

      /* SHOULD BE DONE LIKE:
      models.User.findOrCreateGoogle({
        openId: identifier,
        profile: profile
      }, function(err, user) {
        done(err, user);
      });
      */

      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
  ));

  
  app.get('/auth/google', passport.authenticate('google'));
  
  app.get('/auth/google/return', passport.authenticate('google', 
      {failureRedirect: '/login'}),
    function(req, res) {
      // Successful authentication, redirect home.
      // INITIALIZE USER
      require('../app/controllers/auth').initialize(req, res);
      res.redirect('/');
    });

  app.get('/logout', function(req, res) {
    req.logOut();
    req.app.locals.user = false;
    req.session.user = false;
    res.redirect('/');
  });
}