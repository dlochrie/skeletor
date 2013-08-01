/**
 * See this link for POOLING and ENV Vars for Uname/Password:
 * http://stackoverflow.com/questions/16800418/how-to-properly-pass-mysql-
 *     connection-to-routes-with-express-js#answer-16800702
 */
module.exports = function(app) {
  var mysql = require('mysql');
  
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
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    connectionLimit: 10
  });


  /**
   * Setup MySQL Sessions, and Log Connection Info to Console
   */
   /*
  pool.on('connection', function(err, connection) {
    console.log('MySQL Successfully Connected', pool)
    connection.query('SET SESSION auto_increment_increment=1')
  });
  */

  /**
   * Sanity check: This happens on app startup.
   */
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log('There was an error connecting to the database:\n', err);
    } else {
      console.log('Successfully connected to database:', process.env.MYSQL_DB);
      connection.end();
    }
  });
  
  /** Expose Connection Pool to App */
  app.set('db', {
    "connection": pool,
    models: {}
  });

  /**
   * Initialize Model Caching for DB Queries and Model Definitions
   */
  cacheModelDefinitions(function(err) {
    if (!err) {
      cacheModelQueries(function(err) {
        if (!err) {
          console.log('Models successfully loaded.');
        } else {
          throw('Could not successfully load models. Aborting.');
        }
      });
    } else {
      throw('Could not successfully load models. Aborting.');
    }
  });

  function cacheModelQueries(done) {
    var db = app.settings.db;
    console.log('Begin Caching Queries');
    var Model = require('../app/models/model');
    for (model in db.models) {
      var list = {};
      var def = db.models[model].definition;
      list.find = Model.prepareSelect(def, { limit: 1});
      list.all = Model.prepareSelect(def, { limit: null});
      list.latest = Model.prepareSelect(def, { limit: 10});
      list.create = Model.prepareUpsert(def);
      list.update = Model.prepareUpsert(def);
      list.delete = Model.prepareDelete(def);
      db.models[model].queries = list;
      console.log('-- Loaded', model);
    }
    console.log('Done Caching Queries');
  }

  function cacheModelDefinitions(done) {
    var db = app.settings.db,
      dir = './db/definitions/';
    console.log('Begin Loading Definitions');
    require('fs').readdir(dir, function(err, files) {
      if (err) {
        console.log('There was an error reading in Model Definitions');
        return done(true);
      }
      function loadModel(file) {
        if (file) {
          var name = file.replace(/\.[^/.]+$/, "");
          var data;
          try { 
            data = require(__dirname + '/definitions/' + file);
            console.log('-- Loaded', file);
          } catch(e) {
            console.log('There was an error Loading:', file);
          }
          db.models[name] = {definition: data};
          return loadModel(files.shift());
        } else {
          console.log('Done Loading Definitions.');
          return done(null);
        }
      }
      loadModel(files.shift());
    });
  }
}
