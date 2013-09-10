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
  var sql = 'SELECT DISTINCT `post`.`id`, `post`.`title`, `post`.`user_id`, ' +
      '`post`.`description`, `post`.`description_md`, `post`.`body`, ' +
      '`post`.`body_md`, `post`.`created`, `post`.`updated`, `user`.`id`, ' +
      '`user`.`displayName`, `user`.`email`, ' +
      'COUNT(*) AS `comments` ' +
      'FROM `post` ' +
      'JOIN `user` ON `user`.`id` = `post`.`user_id` ' +
      'JOIN `comment` ON `comment`.`post_id` = `post`.`id` ' +
      'GROUP BY `post`.`id` ' +
      'ORDER BY `post`.`updated` DESC LIMIT 10 ';
  this.performQuery(sql, params, cb);
};

// Validations should go here...