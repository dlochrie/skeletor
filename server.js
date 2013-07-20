/**
 * Module dependencies.
 */

var express = require('express')
  , resource = require('express-resource')
  , http = require('http')
  , path = require('path');

var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('feelinfine0987654321'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
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
 * Replace file with DB-Type you wish to use
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
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
