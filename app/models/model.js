var utils = require('../../util/db-tools');


// Expose Model Class
module.exports = Model;



/**
 * @params {Object} resource (Optional) Resource for contructing model.
 * @constructor
 */
function Model(resource) {
  var name = this.modelName;
  this.db = this.app.get('db');
  this.pool = this.db.pool;
  this.model = this.db.models[name];
  this.queries = this.model.queries;
  this.structure = this.model.structure;
  this.resource = resource;
}


/**
 * Find one record for a model given the search criteria.
 * @param {?Object} opts (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.find = function(opts, cb) {
  var cb = (arguments.length === 1) ? arguments[0] : cb;
  var sql = (this.queries['find']) ? this.queries['find'] : null;
  if (!sql) {
    sql = ''; // generate the query here based on structure
  }
  this.performQuery(sql, cb);
};


/**
 * Find all records for a model.
 * @param {?Object} opts (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.all = function(opts, cb) {
  var cb = (arguments.length === 1) ? arguments[0] : cb;
  var sql = (this.queries['all']) ? this.queries['all'] : null;
  if (!sql) {
    sql = ''; // generate the query here based on structure
  }
  this.performQuery(sql, cb);
};


/**
 * Find the latest records for a model. Default is 10.
 * @param {?Object} opts (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.latest = function(opts, cb) {
  var cb = (arguments.length === 1) ? arguments[0] : cb;
  var sql = (this.queries['latest']) ? this.queries['latest'] : null;
  if (!sql) {
    sql = ''; // generate the query here based on structure
  }
  this.performQuery(sql, cb);
};


/**
 * Execute a MySQL Query.
 * @param {string} sql The SQL query to perform.
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.performQuery = function(sql, cb) {
  var self = this;
  this.dbOpen(function(err, dbc) {
    if (err) return cb(err, null);
    if (sql) {
      var options = {sql: sql, nestTables: '_'}
      query = dbc.query(options, function(err, results) {
        if (err) return cb(err, null);
        return cb(null, results);
      });
      self.dbClose(dbc);
      utils.logSQL(query.sql);
    }
  });
};


/**
 * ...To be implemented
 */
Model.prototype.create = function(cb) {
  var cb = (arguments.length === 1) ? arguments[0] : cb;
  var sql = (this.queries['all']) ? this.queries['all'] : null;
  if (!sql) {
    sql = ''; // generate the query here based on structure
  }
  this.performQuery(sql, cb);
};


/**
 * ...To be implemented
 */
Model.prototype.query = function(stmt, where, limit, cb) {
  var cb = (arguments.length === 1) ? arguments[0] : cb;
  var sql = (this.queries['all']) ? this.queries['all'] : null;
  if (!sql) {
    sql = ''; // generate the query here based on structure
  }
  this.performQuery(sql, cb);
};


/**
 * Get a connection from the DB Pool, 
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.dbOpen = function(cb) {
  var db = this.db;
  if (!db) return cb('There was an error connecting to the database', null);
  db.pool.getConnection(function(err, connection) {
    if (err) {
      console.log('There was an error connecting to the database:\n', err);
      return cb(err, null);
    } else {
      return cb(null, connection);
    }
  });
}


/**
 * Return DB Connection to Pool (if connection exists).
 * @param {Object} dbc MySQL Connection.
 */
Model.prototype.dbClose = function(dbc) {
  if (dbc) {
    try { dbc.end(); } 
    catch(e) { console.log('Could not close DB Connection.')}
  }
}