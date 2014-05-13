/**
 * Base Environment Module.
 * Sets default global application variables.
 * @param {function(Object, Object, Function)} app Express application instance.
 */
module.exports = function(app) {
  // Set up site globals - these are based off of Environmental variables.
  var env = (process.env.NODE_ENV || 'dev').toUpperCase();
  app.set('NODE ENVIRONMENT', env);
  app.set('NODE PORT', process.env[env + '_NODE_PORT'] || 3000);
  app.set('NODE HOST', process.env[env + '_NODE_HOST'] || '0.0.0.0');
  app.set('ROOT PATH', process.env[env + '_ROOT_PATH']);
  app.set('ROOT URL', process.env[env + '_ROOT_URL']);
  app.set('MYSQL DB', process.env[env + '_MYSQL_DB']);
  app.set('MYSQL HOST', process.env[env + '_MYSQL_HOST']);
  app.set('MYSQL USER', process.env[env + '_MYSQL_USER']);
  app.set('MYSQL PASS', process.env[env + '_MYSQL_PASS']);
  app.set('MYSQL MAX CONN', process.env[env + '_MYSQL_MAX_CONN'] || 10);
  app.set('COOKIE SECRET', process.env[env + '_COOKIE_SECRET']);
  app.set('REDIS SECRET', process.env[env + '_REDIS_SECRET']);


  // Extract the Site Owners and store as global.
  var owners = process.env[env + '_SITE_OWNERS'];
  var ownersList = owners ? owners.split(',') : [];
  var siteOwners = ownersList.map(function(owner) {
    // TODO: Maybe also verify if this is an email address or not.
    return owner.trim();
  });
  app.set('SITE OWNERS', siteOwners);


  // Sets the default view engine as "jade".
  var rootPath = app.get('ROOT PATH');
  app.set('views', rootPath + '/app/views');
  app.set('view engine', 'jade');
};
