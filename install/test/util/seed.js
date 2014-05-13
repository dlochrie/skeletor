var fs = require('fs'),
    path = require('path');


// Expose 'Seed' module.
module.exports = new Seed;



/**
 * The Seed module populates fixtures for functional testing.
 * @constructor
 */
function Seed() {
  /**
   * Default options for reading files. Reading as a utf-8-encoded string, as
   * opposed to raw binary, allows for proper sql queries.
   * @private
   */
  this.readOptions_ = {encoding: 'utf8'};

  /**
   * Locally-stored mapping of fixture and mapped SQL.
   * @type {Object.<string, string>}
   * @private
   */
  this.fixtures_ = {
    setup_: null,
    teardown_: null
  };
}


/**
 * Kicks the seed process off.
 * @param {express.app} app Express App instance.
 */
Seed.prototype.init = function(app, model) {
  /**
   * Instance of Node MySQL.
   * @type {Object}
   * @private
   */
  this.db_ = app.db;

  /**
   * Path to fixtures/SQL scripts.
   * @type {string}
   * @private
   */
  this.root_ = app.get('ROOT PATH') + 'test/fixtures/';

  /**
   * The model on which to operate.
   * @type {string}
   * @private
   */
  this.model_ = model;

  // Populate the fixtures.
  this.getFixtures_();
};


/**
 * Process the SQL Query.
 * @param {string} sql The raw SQL to process.
 * @private
 */
Seed.prototype.executeSQL_ = function(sql) {
  this.db.getConnection(function(err, connection) {
    if (err) throw new Error('This fixture (...) could not be added: ' + err);
    connection.query(sql, function(err, result) {
      connection.release(); // Return this connection to the pool.
      if (err) {
        throw new Error('This fixture (...) could not be added: ' + err);
      }
    });
  });
};


/**
 * Gets the basename for a file based on its extension.
 * @param {?string} filename Name of file to get basename for.
 * @private
 * @return {string} Basename of the file.
 */
Seed.prototype.getBaseName_ = function(filename) {
  var basename = (filename || '').replace(Seed.BASE_FILENAME_REGEX_, '');
  return path.basename(basename, '.sql').toLowerCase();
};


/**
 * Gets the fixtures based on model. Reads and stores the sql for both setup and
 * teardown.
 * @private
 */
Seed.prototype.getFixtures_ = function() {
  var fixtures = fs.readdirSync(this.root_),
      model = this.model_,
      self = this;

  fixtures.forEach(function(fixture) {
    if (self.getBaseName_(fixture) === model) {
      fixture = self.root_ + fixture;
      var data = self.readSqlFromFile_(fixture);
      if (self.isSetup_(fixture)) {
        self.fixtures_.setup_ = data;
      } else {
        self.fixtures_.teardown_ = data;
      }
    }
  });
};


/**
 * Determines whether the script is a setup or teardown SQL script, based on
 * filename extension.
 * @param {?string} filename Name of file to test.
 * @private
 * @return {boolean} Whether the script is a setup or teardown script.
 */
Seed.prototype.isSetup_ = function(filename) {
  return (filename || '').toLowerCase().match(Seed.SETUP_FILE_REGEX_);
};


/**
 * Gets the raw SQL from the script by reading it as a UTF-8-encoded string.
 * @param file Full path to the file to read.
 * @private
 * @return The raw SQL data.
 */
Seed.prototype.readSqlFromFile_ = function(file) {
  return fs.lstatSync(file).isFile() ?
      fs.readFileSync(file, this.readOptions_) : null;
};


/**
 * Perform the `setup` operation - usually creating a populating a table.
 */
Seed.prototype.setup = function() {
  if (this.fixture_ && this.fixture_.setup_) {
    this.executeSQL_(this.fixture_.setup_);
  }
};


/**
 * Perform the `teardown` operation - usually deleting a table.
 */
Seed.prototype.teardown = function() {
  if (this.fixture_ && this.fixture_.teardown_) {
    console.log('performing teardown');
    this.executeSQL_(this.fixture_.teardown_);
  }
};


/**
 * Base name of file, less the `setup` or `teardown` suffix.
 * @const
 * @type {RegExp}
 * @private
 */
Seed.BASE_FILENAME_REGEX_ = /_+[a-zA-Z]+/;


/**
 * Regex to determine whether a SQL script is for setup or teardown.
 * @const
 * @type {RegExp}
 * @private
 */
Seed.SETUP_FILE_REGEX_ = /_setup/;
