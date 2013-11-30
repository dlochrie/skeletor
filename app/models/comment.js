var Model = require('./model');


// Expose `Comment` Model
module.exports = Comment;



/**
 * @constructor
 */
function Comment(app, resource) {
  this.app = app;
  this.modelName = 'comment';
  // TODO: Is there a better way to access this, vs on the prototype???
  this.validations = this.VALIDATIONS_;
  Model.call(this, resource);
}
require('util').inherits(Comment, Model);


/**
 * @const {enum {string}}
 * @private
 */
Comment.prototype.VALIDATIONS_ = {};