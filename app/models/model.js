var utils = require('../../util/db-tools');


// Expose Base Model
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
 * @param {?Object} params (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function.
 * @return function
 */
Model.prototype.find = function(params, cb) {
  if (arguments.length === 1) {
    cb = arguments[0];
    params = null;
  }
  return this.select('find', params, cb);
};


/**
 * Find all records for a model.
 * @param {?Object} params (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function.
 * @return function
 */
Model.prototype.all = function(params, cb) {
  if (arguments.length === 1) {
    cb = arguments[0];
    params = null;
  }
  return this.select('all', params, cb);
};


/**
 * Find the latest records for a model. Default is 10.
 * @param {?Object} params (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function.
 * @return function
 */
Model.prototype.latest = function(params, cb) {
  if (arguments.length === 1) {
    cb = arguments[0];
    params = null;
  }
  return this.select('latest', params, cb);
};


/**
 * Create a new Record for a particular model.
 * @param {?Object} params (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function.
 * @return function
 */
Model.prototype.create = function(params, cb) {
  if (arguments.length === 1) {
    cb = arguments[0];
    params = null;
  }
  return this.upsert('create', params, cb);
};


/**
 * Update a Record for a particular model.
 * @param {?Object} params (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function.
 * @return function
 */
Model.prototype.update = function(params, cb) {
  if (arguments.length === 1) {
    cb = arguments[0];
    params = null;
  }
  return this.upsert('update', params, cb);
};


/**
 * * ...To Be Implemented
 * @param {?Object} params (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function.
 * @return function
 */
Model.prototype.delete = function(params, cb) {
  if (arguments.length === 1) {
    cb = arguments[0];
    params = null;
  }

  var sql = this.queries['delete'] || null;
  params = (params) ? params : {};
  params.where = params.where || null;
  params.limit = params.limit || null;

  if (!sql || params.limit) {
    // If there is a LIMIT to add, create a new query
    sql = ''; // TODO: generate the query here based on structure
  }

  this.performQuery(sql, params, function(err, result) {
    if (!err && !result.affectedRows) err = true;
    return cb(err, null);
  });
};


/**
 * Wrapper function for performing SELECT statements.
 * @param {string} type Type of query to look up in cache.
 * @param {?Object} params (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function.
 */
Model.prototype.select = function(type, params, cb) {
  var sql = this.queries[type] || null;
  params = (params) ? params : {};
  params.where = params.where || 1;
  params.limit = params.limit || null;
  if (!sql || params.limit) {
    // If there is a LIMIT to add, create a new query
    sql = ''; // TODO: generate the query here based on structure
  }
  this.performQuery(sql, params, cb);
};


/**
 * Wrapper function for performing UPDATE AND INSERT statements.
 * @param {string} type Type of query to look up in cache.
 * @param {?Object} params (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function.
 */
Model.prototype.upsert = function(type, params, cb) {
  var sql = this.queries[type] || null;
  var self = this,
    where = {};

  params = (params) ? params : {};
  params.where = params.where || null;
  params.values = params.values || null;
  if (params.values) {
    if (type === 'create') params.values.created = new Date;
    params.values.updated = new Date;
  }
  params.limit = params.limit || null;
  if (!sql || params.limit) {
    // If there is a LIMIT to add, create a new query
    sql = ''; // TODO: generate the query here based on structure
  }
  this.performQuery(sql, params, function(err, result) {
    if (!err && result) {
      if (params.where) {
        where = params.where;
      } else if (result.insertId !== 0) {
        var id = result.insertId;
        var field = self.modelName + '.id';
        where[field] = parseInt(id);
      } else {
        return cb(err, null);
      }
      return self.select('find', {where: where}, cb);
    }
  });
};


/**
 * Execute a MySQL Query.
 * @param {string} sql The SQL query to perform.
 * @param {?Object} params (Optional) Values to Update, Delete, or Select from.
 * @param {Function} cb Callback function.
 * @return function
 */
Model.prototype.performQuery = function(sql, params, cb) {
  var self = this;
  this.dbOpen(function(err, dbc) {
    if (err) return cb(err, null);
    var values = [];
    if (params.values) values.push(params.values);
    if (params.where) values.push(params.where);
    if (sql) {
      var options = {
        sql: sql,
        values: values,
        nestTables: '_'
      };
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
    catch(e) { console.log('Could not close DB Connection.'); }
  }
}