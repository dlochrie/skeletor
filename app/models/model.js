var utils = require('../../util/db-tools');


// Expose Base Model
module.exports = Model;



/**
 * @params {Object} resource (Optional) Resource for contructing model.
 * @constructor
 */
function Model() {
  this.db = this.app.get('db');
  // Need a more elegant solution for this, but entire `app` is not needed.
  delete this.app;
  this.pool = this.db.pool;
  this.model = this.db.models[this.modelName];
  this.queries = this.model.queries;
  this.definition = this.model.definition;
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
 * Updates a record for a particular model.
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
 * Removes a record for a particular model.
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
 *
 * Concerning `where`: The node mysql driver does a great job of escaping this
 * field, but if you are `joining` records, be cautious that you don't send
 * an 'abmibigous' id, e.g. `comment.user_id` is preferred to `user_id`.
 *
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
 * TODO: Rework the 'Where' functionality here...
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
  var self = this,
    params = params || {};
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
};


/**
 * Return DB Connection to Pool (if connection exists).
 * @param {Object} dbc MySQL Connection.
 */
Model.prototype.dbClose = function(dbc) {
  if (dbc) {
    try { dbc.end(); }
    catch(e) { console.log('Could not close DB Connection.'); }
  }
};


/**
 * Compares params to in-memory definition and returns those that exist.
 *
 * TODO: This should also perform validation methods that a particular model
 * model provides, ie, make sure id's are int's, title's aren't longer than
 * 255, empty fields, etc.
 *
 * @param {Object} params Resource Object to validate.
 * @param {Function} cb Callback function to call when done.
 */
Model.prototype.validate = function(params, cb) {
  var modelName = this.modelName || null;
  if (!modelName || !params) {
    return cb(true, null);
  }

  // Perform validations...
  // WARNING, this is NOT async... but NEEDS to be.
  var validations = this.validations || null;
  if (validations) {
    for (field in validations) {
      var rules = validations[field];
      var subject = params[field] || null;
      var results = this.testRules_(rules, subject);
      if (!results.passed) {
        return cb('Did not pass validations.', null);
      }
    }
  }

  var definition = null;
  try {
    definition = this.definition.columns[modelName];
  } catch(e) {
    return cb('There was a system error:' + modelName, null)
  }

  if (!definition) return cb(true, null);
  var fields = Object.keys(params);
  var resource = {};
  fields.forEach(function(field) {
    if (definition.indexOf(field) !== -1) {
      resource[field] = params[field];
    }
  });

  return cb(null, resource);
};


/**
 * Performs validation by passing field type and value to the appropriate
 * validation method.
 * @param {Object} rule Rules object containing the rule and its comparison
 *     operator.
 * @param {string} field Field to test againt.
 * @private
 * @return {Object} Results object.
 */
Model.prototype.testRules_ = function(rules, field) {
  var results = {passed: true};
  for (rule in rules) {
    var comparison = rules[rule];
    var pass;
    switch(rule) {
      case 'type':
        pass = this.testType_(field, comparison);
        break;
      case 'min':
        pass = this.testMin_(field, comparison);
        break;
      case 'max':
        pass = this.testMax_(field, comparison);
        break;
      case 'exists':
        pass = this.testExists_(field);
        break;
      case 'email':
        pass = this.testEmail_(field);
        break;
    }
    if (results.passed && !pass) {
      results.passed = false;
    }
    results[rule] = pass;
  }
  return results;
};


/**
 * Verifies if the test subject matches the supplied type.
 * @param {?string} subject The subject to test.
 * @param {*} type The data type to test the subject for.
 * @return {boolean}
 * @private
 */
Model.prototype.testType_ = function(subject, type) {
  if (!subject) return false;
  var result;
  switch(type) {
    case 'string':
      result = typeof(subject) === 'string';
      break;
    case 'integer':
      result = typeof(subject) === 'number';
      break;
    case 'boolean':
      result = typeof(subject) === 'boolean';
      break;
    default:
      result = false;
      break;
  }
  return result;
};


/**
 * Verifies if the test subject is greater than or equal to the min allowed.
 * @param {?string} subject The subject to test.
 * @param {number} min The minimum amount of characters the subject can have.
 * @return {boolean}
 * @private
 */
Model.prototype.testMin_ = function(subject, min) {
  return subject && subject.toString().length >= parseInt(min);
};


/**
 * Verifies if the test subject is less than or equal to the max allowed.
 * @param {?string} subject The subject to test.
 * @param {number} max The maximuma amount of characters the subject can have.
 * @return {boolean}
 * @private
 */
Model.prototype.testMax_ = function(subject, max) {
  return subject && subject.toString().length <= parseInt(max);
};


/**
 * Verifies that the subject does indeed exist.
 * TODO: This is very ugly. There has got to be a better way of testing this.
 * @param {?string} subject The subject to test.
 * @return {boolean}
 * @private
 */
Model.prototype.testExists_ = function(subject) {
  // TODO: What the hell is this???
  return (subject) ? true : false;
};


/**
 * Verifies that the subject is an email address.
 * Note: This might not always work, but since we rely on outside
 * authentication, it's just a quick check and should serve as thus.
 * @param {?string} subject The subject to test.
 * @return {boolean}
 * @private
 */
Model.prototype.testEmail_ = function(subject) {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      .test(subject)
};