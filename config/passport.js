module.exports = function(app) {
  var passport = require('passport'),
      GoogleStrategy = require('passport-google').Strategy,
      User = require('../app/models/user'),
      string = require('../util/string'),
      url = 'http://' + app.get('host') + ':' + app.get('port');

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


  /**
   * Use the Google OpenId Strategy within Passport.
   */
  passport.use(new GoogleStrategy({
    returnURL: url + '/auth/google/return',
    realm: url + '/'
  },
  function(identifier, profile, done) {
    var resource = {
      displayName: profile.displayName,
      google_id: identifier,
      email: profile.emails[0].value
    };
    var model = new User(app, null);
    model.find({where: {email: resource.email}}, function(err, user) {
      user = (user.length) ? user[0] : null;
      if (user) return done(null, user);
      if (err || !user) {
        resource.slug = string.convertToSlug(resource.displayName);
        model.create({values: resource}, function(err, user) {
          if (user) return done(null, user[0]);
          return done(err, null);
        });
      }
    });
  }
  ));


  /**
   * Authenticate the User against the Google OpenId API.
   */
  app.get('/auth/google', passport.authenticate('google'));


  /**
   * Handle the Response from the Google OpenId API.
   */
  app.get('/auth/google/return', passport.authenticate('google',
      {failureRedirect: '/login'}),
      function(req, res) {
        var session = req.session;
        if (session.passport.user) {
          session.logged_in = true;
        }
        res.redirect('/');
      });


  /**
   * Log the user completely out.
   * Regenerate a new session and set `logged_in` to false.
   */
  app.get('/logout', function(req, res) {
    var session = req.session;
    session.logged_in = false;
    req.logOut();
    if (!session || !session.regenerate) return res.redirect('/');
    session.regenerate(function(err) {
      res.redirect('/');
    });
  });
};
