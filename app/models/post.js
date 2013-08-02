var Model = require('./model');


// Expose `Post` Model
module.exports = Post;


/**
 * 
 */
function Post(app, resource) {
  this.app = app;
  this.modelName = 'post';
  Model.call(this, resource);
}
require('util').inherits(Post, Model);

// Validations should go here...