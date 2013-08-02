var dbc = null
  , orange = '\033[33m'
  , reset = '\033[0m'
  , mysql = require('mysql');


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
  this.connection = null;
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


Model.prototype.performQuery = function(sql, cb) {
  dbOpen(function(err, dbc) {
    if (err) return cb(err, null);
    if (sql) {
      var options = {sql: sql, nestTables: '_'}
      query = dbc.query(options, function(err, results) {
        if (err) return cb(err, null);
        return cb(null, results);
      });
      dbClose();
      logSQL(query.sql);
    }
  });
};


/**
 * Create a new record for a particular model.
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.create = function(cb) {
  var cb = (arguments.length === 1) ? arguments[0] : cb;
  var sql = (this.queries['all']) ? this.queries['all'] : null;
  if (!sql) {
    sql = ''; // generate the query here based on structure
  }
  this.performQuery(sql, cb);
};


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
function dbOpen(cb) {
  var db = this.db;
  if (!db) return cb('There was an error connecting to the database', null);
  db.pool.getConnection(function(err, connection) {
    if (err) {
      console.log('There was an error connecting to the database:\n', err);
      return cb(err, null);
    } else {
      console.log('Successfully connected to database:', process.env.MYSQL_DB);
      dbc = connection;
      return cb(null, dbc);
    }
  });
}

/**
 * Return DB Connection to Pool (if connection exists).
 * @private
 */
function dbClose() {
  if (dbc) {
    try { dbc.end(); } 
    catch(e) { console.log('Could not close DB Connection.')}
  }
}

/**
 * Logs an orange-colored message to the console for easy visibility of SQL.
 * @param msg Message to log. 
 */
function logSQL(msg) {
  msg = (msg) ? orange + msg + reset : '';
  console.log(msg);
}

/**
 * TODO: All the Prepare Statement Methods should go in a UTIL Class
 */
Model.prepareSelect = function(struct, params) {
  var primary = mysql.escapeId(struct.primary);
  
  var select = [];
  for (table in struct.columns) {
    var table_ = mysql.escapeId(table);
    struct.columns[table].forEach(function(field) {
      var field_ = mysql.escapeId(field);
      select.push(table_ + '.' + field_)
    });
  }

  var from = struct.primary;

  var joins = [];
  if (struct.joins) {
    struct.joins.forEach(function(join) {
      var relation = mysql.escapeId(join['relation']);
      var relationId = mysql.escapeId(join['relation key']);
      var foreignKey = mysql.escapeId(join['foreign key']);
      var stmt_ = ' JOIN ' + relation;
      stmt_ += ' ON ' + relation + '.' + relationId + ' = ' + 
          primary + '.' + foreignKey;
      joins.push(stmt_);
    });
  }

  var query = 'SELECT ' + select.join(', ') 
      + ' FROM ' + from + 
      ' ' + joins.join(', ');
  if (params.limit) query += ' LIMIT ' + parseInt(params.limit);
  return query;
}


Model.prepareUpsert = function(struct, values, params) {
  var primary = mysql.escapeId(struct.primary);
  var query = 'INSERT INTO ' + primary + ' SET ?';
  if (params) {
    var limit = params.limit || null;
    if (limit) query += ' LIMIT ' + parseInt(limit);
  }
  return query;
}


Model.prepareDelete = function(struct, params) {
  var primary = mysql.escapeId(struct.primary);
  var query = 'DELETE FROM ' + primary;
  if (params) {
    var limit = params.limit || null;
    if (limit) query += ' LIMIT ' + parseInt(limit);
  }
  return query;
}