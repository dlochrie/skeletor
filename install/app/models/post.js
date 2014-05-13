var Base = require('./base');
var Util = require('../controllers/util');


/**
 * Expose `Post` Model
 */
module.exports = Post;



/**
 * Post model constructor.
 * @param {express.app} app Express App instance.
 * @param {Object=} opt_resource Optional resource.
 * @constructor
 * @extends {app.models.base}
 */
function Post(app, opt_resource) {
  this.app = app;
  this.resource = opt_resource || null;
  this.db = app.db;
  Base.call(this);
}
require('util').inherits(Post, Base);


/**
 * Table name.
 * @const
 * @private {string}
 */
Post.TABLE_ = 'post';


/**
 * User's table name.
 * @const
 * @private {string}
 */
Post.USERS_TABLE_ = 'user';


/**
 * Columns to retrieve in SELECT statements.
 * @const
 * @private {Array.<string>}
 */
Post.SELECT_COLUMNS_ = [
  'post.id',
  'post.title',
  'post.description',
  'post.description_md',
  'post.body',
  'post.body_md',
  'post.slug',
  'post.created',
  'post.updated',
  'user.displayName',
  'user.email',
  'user.id',
  'user.slug'
];


/**
 * MySQL Query Strings.
 *
 * TODO: You might want some MORE specific queries here for articles, etc -
 * you don't need all the fields...
 *
 * @enum {string}
 * @private
 */
Post.QUERIES_ = {
  find: 'SELECT ?? FROM `' + Post.TABLE_ + '` ' +
      'LEFT JOIN `' + Post.USERS_TABLE_ + '` ' +
      'ON `' + Post.TABLE_ + '`.`user_id` = `' + Post.USERS_TABLE_ + '`.`id` ' +
      'WHERE ?',
  findOne: 'SELECT ?? FROM `' + Post.TABLE_ + '` ' +
      'LEFT JOIN `' + Post.USERS_TABLE_ + '` ' +
      'ON `' + Post.TABLE_ + '`.`user_id` = `' + Post.USERS_TABLE_ + '`.`id` ' +
      'WHERE ? ' +
      'LIMIT 1',
  insert: 'INSERT INTO `' + Post.TABLE_ + '` SET ?',
  update: 'UPDATE `' + Post.TABLE_ + '` SET ? WHERE ?',
  remove: 'DELETE FROM `' + Post.TABLE_ + '` WHERE ? LIMIT 1'
};


/**
 * Table strucure. Describes field types and validation properties.
 * Note: Fields that will get generated (i.e. date, markdown formatted content)
 *   should NOT be required - they will always fail validation if they are.
 * @enum {Object.<string, string>}
 * @private
 */
Post.STRUCTURE_ = {
  id: {type: 'Number'},
  user_id: {type: 'Number', length: 10, required: true, displayName: 'User'},
  title: {type: 'String', length: 255, required: true, displayName: 'Title'},
  slug: {type: 'String', length: 255},
  description: {type: 'Text'},
  description_md: {type: 'Text', required: true, displayName: 'Description'},
  body: {type: 'Text'},
  body_md: {type: 'Text', required: true, displayName: 'Body'},
  created: {type: 'Number', required: false},
  updated: {type: 'Number', required: false}
};


/**
 * Gets the named query, or returns them all.
 * @param {?string} action Type of query to get/perform.
 * @return {string|Object} query or queries.
 */
Post.prototype.getQuery = function(action) {
  if (action) {
    return Post.QUERIES_[action];
  } else {
    return Post.QUERIES_;
  }
};


/**
 * Gets the columns to be displayed in a result, or returns them all.
 * @param {?string} action Type of query to get/perform.
 * @return {string|Object} query or queries.
 */
Post.prototype.getColumns = function(action) {
  return Post.SELECT_COLUMNS_;
};


/**
 * Gets the current model's structure.
 * @return {Object} structure object.
 */
Post.prototype.getStructure = function() {
  return Post.STRUCTURE_;
};


/**
 * Gets the table name for the current model.
 * @return {string} table name.
 */
Post.prototype.getTable = function() {
  return Post.TABLE_;
};


/**
 * Add / Modify fields that are not populated by the form, and that need to be
 * generated.
 * @return {Object.<string, string>} The updated Post resource.
 */
Post.prototype.prepare = function() {
  var resource = this.resource;
  var date = Util.getDate();
  // TODO: 'created' shouldn't update on edit, only on insert.
  resource.created = date;
  resource.updated = date;
  resource.slug = Util.convertToSlug(resource.title);
  resource.body_md = Util.sanitize(resource.body_md);
  resource.body = Util.convertMarkdown(resource.body_md);
  resource.description_md = Util.sanitize(resource.description_md);
  resource.description = Util.convertMarkdown(resource.description_md);
  return resource;
};
