/**
 * Loads all helper files.
 * @param {Function} app Instance of Express App.
 */
module.exports = function(app) {
  var dir = app.get('ROOT PATH') + 'app/helpers',
      fs = require('fs'),
      helpers = fs.readdirSync(dir);

  helpers.forEach(function(helper) {
    require(dir + '/' + helper)(app);
  });
};
