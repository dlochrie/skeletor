var isSet = this.app || null;
app = (isSet) ? app : require('../server');

/**
 * Create a mock session class and expose it to `app`.
 */
function Session() {
  this.logged_in = true;
  this.passport = {
    user: {
      user_displayName:  'Testing Tester'
    }
  };
};

app.request.session = new Session();