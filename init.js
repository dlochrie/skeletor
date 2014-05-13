/**
 * Base Initialization Module
 *
 * This module sets up the application definitions, and loads all required
 * core modules.
 *
 * If any error is encountered, this module should terminate the application.
 * @param {function(Object, Object, Function)} app Express application instance.
 * @param {Function} express Express/Connect instance.
 */
module.exports = function(app, express) {
  var dir = __dirname + '/core/',
      fs = require('fs');

  // Load all required core files. Order is important.
  var modules = [
    'environment',
    'middleware'
  ];
  modules.forEach(function(module) {
    require(dir + '/' + module)(app);
  });

  // Extract environmental variables.
  var root = app.get('ROOT PATH'),
      env = app.get('NODE ENVIRONMENT');

  // Setup environment-specific settings.
  // For example, if you are adding a custom logger to Dev, but you don't want
  // to use it in Prod, then you can create a `dev` file for dev-specific
  // settings.
  var conf = root + 'config/environment/' + env.toLowerCase() + '.js';
  if (fs.existsSync(conf) && fs.lstatSync(conf).isFile()) {
    require(conf)(app, express);
  }

  // Load application-specific config files (routes, etc) from the `app/config`
  // directory. Any overrides, or custom settings/middleware should come from
  // here.
  var confs = fs.readdirSync(root + 'config');
  confs.forEach(function(conf) {
    var path = root + 'config/' + conf;
    if (fs.lstatSync(path).isFile() && conf !== 'routes.js') {
      require(path)(app);
    }
  });

  // Always load the Routes last.
  require(root + 'config/routes.js')(app);
};
