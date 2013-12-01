/**
 * Module dependencies.
 */
var express = require('express'),
  resource = require('express-resource'),
  flash = require('connect-flash'),
  http = require('http'),
  path = require('path'),
  passport = require('passport');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('host', process.env.HOST || '0.0.0.0');
  app.use(express.static(app.root + '/public', {
    maxAge: 86400000
  }));
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('feelinfine0987654321'));
  app.use(express.session());
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * Make the User's Name available to Views
   * TODO: Is this necessary every request???
   */
  app.use(function(req, res, next) {
    if (req.session.logged_in) {
      res.locals.user = req.session.passport.user;
    }
    next();
  });

  /**
   * Expose Flash Middleware to Views.
   */
  app.use(function(req, res, next) {
    res.locals.messages = req.flash();
    next()
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// TODO: Put this here????
// TODO: Doesn't seem to be putting ellipses on the correct string length.
app.locals.truncateAndStripTags = function(string, maxLength) {
  var original = string;
  if (string) {
    string = string
        .replace(/(<([^>]+)>)/ig,"")
        .substring(0, maxLength);
    if (original.length >= maxLength) {
      string += '&hellip;';
    }
    return string;
  }
};

/**
 * Setup Routes
 */
require('./config/routes')(app);

/**
 * Setup Environment-Specific Settings
 */
require('./config/environment')(app);

/**
 * Setup Passport-Specific Settings
 */
require('./config/passport')(app);

/**
 * Setup Dabasase-Specific Settings
 * Replace file with DB-Type you wish to use, ie `redis`
 */
require('./db/mysql')(app, function() {
  http.createServer(app).listen(app.get('port'), app.get('host'), function(){
    console.log("Express server listening on port " + app.get('port') +
      ' in the `' + process.env.NODE_ENV + '` environment.');
  });
});

/**
 * Expose the app module.
 * This is required for functional testing.
 */
module.exports = app;