var dbc = null
  , orange = '\033[33m'
  , reset = '\033[0m';


// Expose Model Class
module.exports = Model;



/**
 * @params {Object} resource (Optional) Resource for contructing model.
 * @constructor
 */
function Model(resource) {}


/**
 * Find one records for a model given the `id`.
 * @param {Function} cb Callback function. 
 * @return function
 */
Model.prototype.find = function find(id, cb) {
  var self = this;
  dbOpen(this.app, function(err, dbc) {
    if (err) return cb(err, null);
    var query = dbc.query('SELECT * FROM ?? WHERE id = ? LIMIT 1', 
        [self.modelName, id], function(err, result) {
      if (err) return cb(err, null);
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
Model.prototype.all = function all(cb) {
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