var Model = require('./model');


// Expose `Post` Model
module.exports = Post;



/**
 * @constructor
 */
function Post(app, resource) {
  this.app = app;
  this.modelName = 'post';
  resource = resource || {};
  Model.call(this, resource);
}
require('util').inherits(Post, Model);


Post.prototype.latest = function(params, cb) {
  var sql = 'SELECT `post`.`id`, `post`.`title`, `post`.`description`, ' +
      '`post`.`created`, `user`.`displayName`, `user`.`slug`, `post`.`slug`, ' +
      'COUNT(`comment`.`post_id`) AS `comments` ' +
      'FROM `post` ' +
      'LEFT JOIN `user` ON `user`.`id` = `post`.`user_id` ' +
      'LEFT JOIN `comment` ON `comment`.`post_id` = `post`.`id` ' +
      'GROUP BY `comment`.`post_id` ' +
      'ORDER BY `post`.`updated` DESC LIMIT 10 ';
  this.performQuery(sql, params, cb);
};

Post.prototype.adminList = function(params, cb) {
  var sql = 'SELECT `post`.`id`, `post`.`title`, `post`.`created`, ' +
    '`post`.`updated`, `user`.`id`, `user`.`displayName`,  ' +
    'COUNT(`comment`.`post_id`) AS `comments` ' +
    'FROM `post`  ' +
    'LEFT JOIN `user` ON `user`.`id` = `post`.`user_id` ' +
    'LEFT JOIN `comment` ON `comment`.`post_id` = `post`.`id` ' +
    'GROUP BY `comment`.`post_id` ' +
    'ORDER BY `post`.`updated` DESC';
  this.performQuery(sql, params, cb);
};

// Validations should go here...