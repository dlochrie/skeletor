var Model = require('./model');


// Expose `Post` Model
module.exports = Post;



/**
 * @constructor
 */
function Post(app, resource) {
  this.app = app;
  this.modelName = 'post';
  this.resource = resource || {};
  this.validations = Post.VALIDATIONS_;
  Model.call(this);
}
require('util').inherits(Post, Model);


/**
 * Returns the latest 10 posts with comment count and user metadata.
 * @param {Object} params Model resource properties.
 * @param {function} cb Callback function.
 */
Post.prototype.latest = function(params, cb) {
  var sql = 'SELECT `post`.`id`, `post`.`title`, `post`.`description`, ' +
      '`post`.`created`, `user`.`displayName`, `user`.`slug`, `post`.`slug`, ' +
      'COUNT(`comment`.`post_id`) AS `comments` ' +
      'FROM `post` ' +
      'LEFT JOIN `user` ON `user`.`id` = `post`.`user_id` ' +
      'LEFT OUTER JOIN `comment` ON `comment`.`post_id` = `post`.`id` ' +
      'GROUP BY `post`.`id` ' +
      'ORDER BY `post`.`updated` DESC LIMIT 10 ';
  this.performQuery(sql, params, cb);
};


/**
 * Returns the all posts with comment count and user metadata.
 * @param {Object} params Model resource properties.
 * @param {function} cb Callback function.
 */
Post.prototype.adminList = function(params, cb) {
  var sql = 'SELECT `post`.`id`, `post`.`title`, `post`.`slug`, ' +
      '`post`.`created`, `post`.`updated`, `user`.`id`, ' +
      '`user`.`displayName`, ' +
      'COUNT(`comment`.`post_id`) AS `comments` ' +
      'FROM `post` ' +
      'LEFT JOIN `user` ON `user`.`id` = `post`.`user_id` ' +
      'LEFT OUTER JOIN `comment` ON `comment`.`post_id` = `post`.`id` ' +
      'GROUP BY `post`.`id` ' +
      'ORDER BY `post`.`updated` DESC';
  this.performQuery(sql, params, cb);
};


/**
 * @const {enum {string}}
 * @private
 */
Post.VALIDATIONS_ = {
  title: {
    min: 10,
    max: 100
  },
  body: {
    min: 10
  },
  description: {
    min: 10
  },
  user_id: {
    type: 'integer',
    exists: true
  }
};
