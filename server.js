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
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('feelinfine0987654321'));
  app.use(express.session());
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * Setup Anti-Forgery
   * usage: (Where `token` is available as a local var)
   *   input(name="csrf-token",type="hidden,content=token)
   */
  app.use(express.csrf());
  app.use(function(req, res, next) {
    res.locals.token = req.session._csrf;
    next();
  });

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
require('./db/mysql')(app);


/**
 * TODO: Move this up into `configure`, and add to a module
 * Log Request Info
 */
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});


/*
app.configure('development', function(){
  app.use(express.errorHandler());
});
*/


/**
 * Start Server
 * TODO: Should do this after initialization.
 */
http.createServer(app).listen(app.get('port'), app.get('host'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
