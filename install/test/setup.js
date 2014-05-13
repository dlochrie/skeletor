var Session = require('./util/session');


// Force `test` environment for tests.
process.env.NODE_ENV = 'test';

// Make sure the global `app` is available to tests.
app = this.app || require('../app');


// Expose `Session` class to app for testing access.
app.session = Session;
