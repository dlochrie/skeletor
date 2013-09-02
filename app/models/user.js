var Model = require('./model');


// Expose `User` Model
module.exports = User;


/**
 * @constructor
 */
function User(app, resource) {
  this.app = app;
  this.modelName = 'user';
  Model.call(this, resource);
}
require('util').inherits(User, Model);

// Validations should go here...