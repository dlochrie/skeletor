// Force `test` environment for tests.
process.env.NODE_ENV = 'test';

app = this.app || require('../server');

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

Session.prototype.logout = function() {
  this.logged_in = false;
  this.passport = {};
};