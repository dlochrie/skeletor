/**
 * These tests do not test that Express/Connect/Passport/etc middleware is
 * working/loaded as needed - only that `custom` middleware is working/loaded.
 */
var express = require('express'),
    request = require('supertest');


/**
 * Tests that `flash` is available to the session.
 */
function testConnectFlash(req, res, next) {
  res.locals.messages.should.be.an.Object;
  req.session.flash.should.be.an.Object;
  res.locals.messages.should.eql(req.session.flash);
  next();
}


/**
 * Tests that the `user` locals var is set, which requires custom middleware.
 * This DOES NOT test authentication -- ONLY that if the `logged_in` property is
 * set to true on the session, that the local `user` var will be set.
 */
function testLoadUserLocal(req, res, next) {
  req.session.passport.should.be.an.Object;
  (res.locals.user === req.session.passport.user).should.be.true;
  next();
}


// Set up the tests.
var app = express();
app.session = {
  logged_in: true,
  passport: {
    user: null
  }
};
app.set('ROOT PATH', '/test/path');
app.set('REDIS SECRET', 'test-secret');
require('../../config/environment/dev')(app);


// Enable the test middleware - required to access the `req` request objects.
// app.use(testConnectFlash);
// app.use(testLoadUserLocal);


describe('Core middleware module', function() {
  // TODO: This before hook feels really awkward. Should revisit establishing
  // sessions like this.
  beforeEach(function(done) {
    app.request.session = app.session;
    var session = app.request.session;
    session.logged_in.should.be.true;
    session.passport.should.be.an.Object;
    done();
  });

  it('should register the core middleware', function(done) {
    request(app)
      .get('/')
      .end(done);
  });
});

