/**
 * See this link for POOLING and ENV Vars for Uname/Password:
 * http://stackoverflow.com/questions/16800418/how-to-properly-pass-mysql-
 *     connection-to-routes-with-express-js#answer-16800702
 */

/**
 * Load the Database and Model configuration into memory for quick access.
 * Since the callback is typically the listener for the server, any error
 * here would prevent the server from running.
 *
 * @param {Object} app Express application object.
 * @param {Function} cb The callback to run when done.
 */
module.exports = function(app, cb) {
  var mysql = require('mysql'),
    utils = require('../util/db-tools'),
    env = process.env,
    mode = String(env.NODE_ENV || 'dev').toUpperCase(),
    database = env[mode + '_' + 'MYSQL_DB'];

  /**
   * Set the DB Credentials in your environmental variables:
   *   Set Temporarily:
   *   -- export MYSQL_HOST=localhost
   *   -- export etc=etc
   *   Set Permanently: (in ~/.pam_environment [ubuntu] OR ~/.bashrc)
   *   -- export MYSQL_HOST=localhost
   *   -- export etc=etc
   *
   * NOTE: Name your vars what you want, just make sure that you modify
   * the process.env.{} object to reflect that below. i.e., instead of
   * `MYSQL_DB`, you can change to `APPNAME_DB`.
   */
  var pool = mysql.createPool({
    database: database = env[mode + '_' + 'MYSQL_DB'],
    host: env[mode + '_' + 'MYSQL_HOST'],
    user: env[mode + '_' + 'MYSQL_USER'],
    password: env[mode + '_' + 'MYSQL_PASS'],
    connectionLimit: 10
  });

  /**
   * Expose Connection Pool to App
   */
  app.set('db', {
    pool: pool,
    models: {}
  });

  initialize(function() {
    var block = '+---------------------------------------------------------\n' +
        '| Successfully Loaded Models and Database Connections\n' +
        '+---------------------------------------------------------';
    logToConsole(block);
    cb();
  });

  /**
   * Perform caching and DB testing for startup.
   */
  function initialize(done) {
    var block = '+--------------------------------------------------------' +
        '-\n| Initializing Models and Database Connections\n' +
        '+---------------------------------------------------------';
    logToConsole(block);
    checkConnectionPool(pool, function(connection) {
      logToConsole('Successfully Connected to Database: ' + database);
      connection.end();

      /**
       * Initialize Model Caching for DB Queries and Model Definitions
       */
      cacheModelDefinitions(function(err) {
        if (!err) {
          cacheModelQueries(done);
        } else {
          throw('Could not successfully load models. Aborting.');
        }
      });
    });
  }

  /**
   * Logs an light blue-colored message to the console.
   *
   * @param {string} msg Message to log.
   */
  function logToConsole(msg) {
    var fontColor = '\033[36m',
      resetColor = '\033[0m';
    msg = (msg) ? fontColor + msg + resetColor : '';
    console.log(msg);
  }

  /**
   * Store the SQL Queries for each model for better performance.
   * This eliminates the need to assemble a new statement for a partucular
   * query in an ORM-like fashion, and should suffice for most requests.
   */
  function cacheModelQueries(done) {
    var db = app.settings.db;
    var models = Object.keys(db.models);
    if (!models.length) return done();

    function cacheQuery(model) {
      if (model) {
        var list = {};
        var def = db.models[model].definition;
        var primary = db.models[model].definition.primary;
        var order = [{field: primary + '.updated', direction: 'DESC'}];
        list.find = utils.prepareSelect(def, {limit: 1, order: order});
        list.all = utils.prepareSelect(def, {order: order});
        list.latest = utils.prepareSelect(def, {limit: 10, order: order});
        list.create = utils.prepareInsert(def);
        list.update = utils.prepareUpdate(def);
        list.delete = utils.prepareDelete(def);
        db.models[model].queries = list;
        logToConsole('-- Loaded ' + model);
        cacheQuery(models.shift());
      } else {
        logToConsole('...Done Caching Queries');
        return done();
      }
    }
    logToConsole('Begin Caching Queries...');
    cacheQuery(models.shift());
  }

  /**
   * Cache the JSON structure of each model on the `db` object. This reference
   * helps to speed up the creation of SQL statements for custom requests.
   *
   * @param {Function} done Callback function.
   */
  function cacheModelDefinitions(done) {
    var db = app.settings.db,
      dir = './db/definitions/';
    logToConsole('Begin Loading Definitions...');
    require('fs').readdir(dir, function(err, files) {
      if (err) {
        throw('There was an error reading in Model Definitions');
        return done(true);
      }
      function loadModel(file) {
        if (file) {
          var name = file.replace(/\.[^/.]+$/, "");
          var data;
          try {
            data = require(__dirname + '/definitions/' + file);
            logToConsole('-- Loaded ' + file);
          } catch(e) {
            var msg = 'There was an error Loading: ' + file + ', ' + e;
            throw(msg);
          }
          db.models[name] = {definition: data};
          return loadModel(files.shift());
        } else {
          logToConsole('...Done Loading Definitions');
          return done(null);
        }
      }
      loadModel(files.shift());
    });
  }

  /**
   * As a sanity check, test the connection to the MySQL pool. The app should
   * abort if no connection can be made.
   *
   * @param {Object} pool The MySQL connection pool.
   * @param {Function} done Callback function.
   */
  function checkConnectionPool(pool, done) {
    pool.getConnection(function(err, connection) {
      logToConsole('Checking Database Connection Pool');
      if (err) {
        var msg = 'There was an error connecting to the database: ' + err;
        throw(msg);
      } else {
        return done(connection);
      }
    });
  }
};