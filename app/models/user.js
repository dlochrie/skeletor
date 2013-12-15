var Model = require('./model');


// Expose `User` Model
module.exports = User;



/**
 * @constructor
 */
function User(app, resource) {
  this.app = app;
  this.modelName = 'user';
  this.validations = User.VALIDATIONS_;
  Model.call(this, resource);
}
require('util').inherits(User, Model);


/**
 * @const {enum {string}}
 * @private
 */
User.VALIDATIONS_ = {
  displayName: {
    exists: true,
    min: 6,
    max: 100,
    type: 'string'
  },
  email: {
    email: true,
    min: 10
  }
};
