var Model = require('./model');


// Expose `Comment` Model
module.exports = Comment;


/**
 * @constructor
 */
function Comment(app, resource) {
  this.app = app;
  this.modelName = 'comment';
  resource = resource || {};
  Model.call(this, resource);
}
require('util').inherits(Comment, Model);

// Validations should go here...