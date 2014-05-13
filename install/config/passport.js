/**
 * Passport Authentication Module.
 * @param {function(Object, Object, Function)} app Express application instance.
 */
module.exports = function(app) {
  var passport = require('passport'),
      GoogleStrategy = require('passport-google').Strategy,
      rootPath = app.get('ROOT PATH'),
      rootUrl = app.get('ROOT URL'),
      User = require(rootPath + 'app/models/user');


  function handleResponse(err, result, done) {
    if (!err) {
      done(null, result);
    } else {
      /**
       * First argument MUST be null/false or `failureFlash` won't fire.
       */
      done(null, result, {message: err});
    }
  }

  // Passport session setup.
  // To support persistent login sessions, Passport needs to be able to
  // serialize users into and deserialize users out of the session.  Typically,
  // this will be as simple as storing the user ID when serializing, and finding
  // the user by ID when deserializing.  However, since this example does not
  // have a database of user records, the complete Google profile is serialized
  // and deserialized.
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
    returnURL: rootUrl + 'auth/google/return',
    realm: rootUrl
  },
  function(identifier, profile, done) {
    var resource = {
      displayName: profile.displayName,
      google_id: identifier,
      email: profile.emails[0].value
    };

    var user = new User(app, {email: resource.email});
    user.findOne(function(err, result) {
      if (err || result) return handleResponse(err, result.user, done);
      user.resource = resource;
      return user.insert(function(err, result) {
        err = err ? 'There was an error creating the User: ' + err : false;
        result = result || null;
        handleResponse(err, result, done);
      });
    });
  }));


  /**
   * Authenticate the User against the Google OpenId API.
   */
  app.get('/auth/google', passport.authenticate('google'));


  /**
   * Handle the Response from the Google OpenId API.
   */
  app.get('/auth/google/return', passport.authenticate('google', {
    failureFlash: true,
    failureRedirect: '/login'
  }), function(req, res) {
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
