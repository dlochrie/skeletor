var Model = require('./model');


// Expose `Comment` Model
module.exports = Comment;



/**
 * @constructor
 */
function Comment(app, resource) {
  this.app = app;
  this.modelName = 'comment';
  this.validations = Comment.VALIDATIONS_;
  Model.call(this, resource);
}
require('util').inherits(Comment, Model);


/**
 * @const {enum {string}}
 * @private
 */
Comment.VALIDATIONS_ = {};
