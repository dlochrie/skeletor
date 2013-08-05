var mysql = require('mysql'),
  orange = '\033[33m', 
  reset = '\033[0m';


/**
 * Prepares a `SELECT` SQL statement.
 *
 * @param {Object} struct JSON object defining the model structure.
 * @param {?Object} params Object containing parameters on which to customize
 *    the SQL statement, such as `LIMIT` or `WHERE`.
 */
exports.prepareSelect = function(struct, params) {
  var primary = mysql.escapeId(struct.primary),
    params = (params) ? params : {};
  
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
      joins.join(', ');
  if (params.limit) query += ' LIMIT ' + parseInt(params.limit);
  return query;
}


/**
 * Prepares an `INSERT` SQL statement.
 *
 * @param {Object} struct JSON object defining the model structure.
 * @param {?Object} params Object containing parameters on which to customize
 *    the SQL statement, such as `LIMIT` or `WHERE`.
 */
exports.prepareInsert = function(struct, params) {
  var primary = mysql.escapeId(struct.primary),
    params = (params) ? params : {};

  var query = 'INSERT INTO ' + primary + ' SET ?';
  if (params.limit) query += ' LIMIT ' + parseInt(params.limit);
  return query;
}


/**
 * Prepares an `UPDATE` SQL statement.
 *
 * @param {Object} struct JSON object defining the model structure.
 * @param {?Object} params Object containing parameters on which to customize
 *    the SQL statement, such as `LIMIT` or `WHERE`.
 */
exports.prepareUpdate = function(struct, params) {
  var primary = mysql.escapeId(struct.primary),
    params = (params) ? params : {};

  var query = 'UPDATE ' + primary + ' SET ?';
  if (params.limit) query += ' LIMIT ' + parseInt(params.limit);
  return query;
}


/**
 * Prepares a `DELETE` SQL statement.
 *
 * @param {Object} struct JSON object defining the model structure.
 * @param {?Object} params Object containing parameters on which to customize
 *    the SQL statement, such as `LIMIT` or `WHERE`.
 */
exports.prepareDelete = function(struct, params) {
  var primary = mysql.escapeId(struct.primary),
    params = (params) ? params : {};

  var query = 'DELETE FROM ' + primary;
  if (params.limit) query += ' LIMIT ' + parseInt(params.limit);
  return query;
}


/**
 * Logs an orange-colored message to the console for easy visibility of SQL.
 *
 * @param {string} msg Message to log. 
 */
exports.logSQL = function(msg) {
  msg = (msg) ? orange + msg + reset : '';
  console.log(msg);
}