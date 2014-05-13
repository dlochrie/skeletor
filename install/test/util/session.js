// Expose 'Session' module.
module.exports = Session;



/**
 * Create a mock session class and expose it to `app`.
 * @constructor
 */
function Session() {
  this.logged_in = true;
  this.passport = {
    user: {
      user_displayName: 'Testing Tester'
    }
  };
}


/**
 * Provide a mock logout method for functional testing.
 */
Session.prototype.logout = function() {
  this.logged_in = false;
  this.passport = {};
};
