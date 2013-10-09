var isSet = this.app || null;
app = (isSet) ? app : require('../server');

// Expose `Session` class to app for testing access.
app.session = Session;

/**
 * Create a mock session class and expose it to `app`.
 */
function Session() {
  this.logged_in = true;
  this.passport = {
    user: {
      user_displayName: 'Testing Tester'
    }
  };
};