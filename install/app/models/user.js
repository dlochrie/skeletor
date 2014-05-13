var Base = require('./base');
var Util = require('../controllers/util');


/**
 * Expose `User` Model
 */
module.exports = User;



/**
 * User model constructor.
 * @param {express.app} app Express App instance.
 * @param {Object=} opt_resource Optional resource.
 * @constructor
 * @extends {app.models.base}
 */
function User(app, opt_resource) {
  this.app = app;
  this.resource = opt_resource || null;
  this.db = app.db;
  Base.call(this);
}
require('util').inherits(User, Base);


/**
 * Table name.
 * @const
 * @private {string}
 */
User.TABLE_ = 'user';


/**
 * Columns to retrieve in SELECT statements.
 * @const
 * @private {Array.<string>}
 */
User.SELECT_COLUMNS_ = [
  'user.id',
  'user.displayName',
  'user.slug',
  'user.email',
  'user.created',
  'user.updated'
];


/**
 * MySQL Query Strings.
 * @enum {string}
 * @private
 */
User.QUERIES_ = {
  find: 'SELECT ?? FROM `' + User.TABLE_ + '` WHERE ?',
  findOne: 'SELECT ?? FROM `' + User.TABLE_ + '` WHERE ? LIMIT 1',
  insert: 'INSERT INTO `' + User.TABLE_ + '` SET ?',
  update: 'UPDATE `' + User.TABLE_ + '` SET ? WHERE ?',
  remove: 'DELETE FROM `' + User.TABLE_ + '` WHERE ? LIMIT 1'
};


/**
 * Table strucure. Describes field types and validation properties.
 * Note: Fields that will get generated (i.e. date, markdown formatted content)
 *   should NOT be required - they will always fail validation if they are.
 * @enum {Object.<string, string>}
 * @private
 */
User.STRUCTURE_ = {
  id: {type: 'Number'},
  displayName: {type: 'String', length: 100, required: true},
  slug: {type: 'String', length: 100},
  email: {type: 'String', length: 100, required: true},
  google_id: {type: 'String', length: 100},
  facebook_id: {type: 'Number', length: 100},
  twitter: {type: 'String', length: 100},
  created: {type: 'Number'},
  updated: {type: 'Number'}
};


/**
 * Gets the named query, or returns them all.
 * @param {?string} action Type of query to get/perform.
 * @return {string|Object} query or queries.
 */
User.prototype.getQuery = function(action) {
  if (action) {
    return User.QUERIES_[action];
  } else {
    return User.QUERIES_;
  }
};


/**
 * Gets the columns to be displayed in a result, or returns them all.
 * @param {?string} action Type of query to get/perform.
 * @return {string|Object} query or queries.
 */
User.prototype.getColumns = function(action) {
  return User.SELECT_COLUMNS_;
};


/**
 * Gets the current model's structure.
 * @return {Object} structure object.
 */
User.prototype.getStructure = function() {
  return User.STRUCTURE_;
};


/**
 * Gets the table name for the current model.
 * @return {string} table name.
 */
User.prototype.getTable = function() {
  return User.TABLE_;
};


/**
 * Add / Modify fields that are not populated by the form, and that need to be
 * generated.
 * @return {Object.<string, string>} The updated User resource.
 */
User.prototype.prepare = function() {
  var resource = this.resource;
  var date = Util.getDate();
  // TODO: 'created' shouldn't update on edit, only on insert.
  resource.created = date;
  resource.updated = date;
  resource.slug = Util.convertToSlug(resource.displayName);
  return resource;
};
