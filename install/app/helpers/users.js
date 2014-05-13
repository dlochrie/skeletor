/**
 * Users helper. Provides view helper methods.
 * @param {function(Object, Object, Function)} app Express application instance.
 */
module.exports = function(app) {
  /**
   * @constructor
   */
  app.locals.User = function() {};


  /**
   * Checks to see if the user is an Owner.
   * @param {Object.<string, string>} user User object.
   * @return {boolean} Whether the user is an owner or not.
   */
  app.locals.User.isOwner = function(user) {
    return user ? (app.get('SITE OWNERS').indexOf(user.email) !== -1) : false;
  };
};
