var request = require('supertest'),
  should = require('should'),
  app = require('../setup').app;

describe('Authentication', function () {
  beforeEach(function(done) {
    /**
     * Create a mock session for a successfully logged-in user.
     */
    app.request.session = {
      passport: {
        user: {
          user_displayName:  'Testing Tester'
        }
      },
      logged_in: true
    };
    done();
  });

  it('should create user session for valid user', function (done) {
    var session = app.request.session;
    session.logged_in.should.be.true;
    session.passport.should.be.an.Object;

    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('Testing Tester');
        res.text.should.not.include('login');
        done();
    });
  });

  // TODO: Move this to an ACL Test
  it('should do something on the admin page', function (done) {
    request(app)
      .get('/admin')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('Administration Portals');
        done();
    });
  });

  it('should log the user out', function (done) {
    var session = app.request.session;
    session.logged_in.should.be.true;
    session.passport.should.be.an.Object;

    request(app)
      .get('/logout')
      .end(function (err, res) {
        if (err) return done(err);
        // Follow redirect
        request(app)
          .get('/')
          .end(function (err, res) {
            // TODO: Test that session/passport has been cleared.
            if (err) return done(err);
            res.text.should.not.include('Testing Tester');
            res.text.should.include('login');
            done();
          });
      });
  });
});
