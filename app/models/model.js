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
  this.resource = resource;
}


/**
 * Find one records for a model given the search criteria.
 * @param {?Object} params (Optional) Resource/Criteria to use in search.
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.find = function(params, cb) {
  var self = this;
  var params = (params) ? params : self.resource;
  dbOpen(this.app, function(err, dbc) {
    if (err) return cb(err, null);
    var query = dbc.query('SELECT * FROM ?? WHERE ? LIMIT 1', 
        [self.modelName, params], function(err, result) {
      if (err) return cb(err, null);
      console.log(result);
      return cb(null, result[0]);
    });
    dbClose();
    logSQL(query.sql);
  });
};

/**
 * Find all records for a model.
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.all = function(cb) {
  var self = this;
  dbOpen(this.app, function(err, dbc) {
    if (err) return cb(err, null);
    var query = dbc.query('SELECT * FROM ??', 
        [self.modelName], function(err, results) {
      if (err) return cb(err, null);
      return cb(null, results);
    });
    dbClose();
    logSQL(query.sql);
  });
};

/**
 * Create a new record for a particular model.
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.create = function(cb) {
  var self = this;
  self.resource.created = new Date;
  self.resource.updated = new Date;
  dbOpen(this.app, function(err, dbc) {
    if (err) return cb(err, null);
    var query = dbc.query('INSERT INTO ?? SET ?', 
        [self.modelName, self.resource], function(err, result) {
      if (err) return cb(err, null);
      return cb(null, result);
    });
    dbClose();
    logSQL(query.sql);
  });
};

Model.prototype.query = function(stmt, where, limit, cb) {
  dbOpen(this.app, function(err, dbc) {
    if (err) return cb(err, null);
    var query = dbc.query(stmt + ' WHERE ? ', [where], function(err, result) {
      if (err) return cb(err, null);
      return cb(null, result);
    });
    dbClose();
    logSQL(query.sql);
  });
}

/**
 * Get a connection from the DB Pool, 
 * @param {Function} cb Callback function. 
 * @return function
 */
function dbOpen(app, cb) {
  if (!app) return cb('There was an error connecting to the database', null);
  app.db.getConnection(function(err, connection) {
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
 * Prepare a Query based on a JSON Structure.
 * it will use the cached query.
 */
Model.prototype.prepareQuery = function(struct) {
  console.log(struct)
  var primary = mysql.escapeId(struct.primary),
    where = ''
    limit = 25;
  
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
  return query;
}

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
    // TODO: HANDLE `WHERE`???
  if (params.limit) query += ' LIMIT ' + parseInt(params.limit);
  return query;
}

Model.prepareUpsert = function(struct, values, params) {
  var primary = mysql.escapeId(struct.primary);
  
  var query = 'INSERT INTO ' + primary + ' SET ?';
    
  // TODO: HANDLE `WHERE`???
  
  if (params) {
    var limit = params.limit || null;
    if (limit) query += ' LIMIT ' + parseInt(limit);
  }
  return query;
}

Model.prepareDelete = function(struct, params) {
  var primary = mysql.escapeId(struct.primary);
  
  var query = 'DELETE FROM ' + primary;
  
  // TODO: HANDLE `WHERE`???
  
  if (params) {
    var limit = params.limit || null;
    if (limit) query += ' LIMIT ' + parseInt(limit);
  }
  return query;
}