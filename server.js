/**
 * Module dependencies.
 */

var express = require('express')
  , resource = require('express-resource')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
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
