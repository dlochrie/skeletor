var request = require('supertest'),
  should = require('should');

describe('Authentication', function() {
  var session;

  beforeEach(function(done) {
    app.request.session = new app.session();
    session = app.request.session;
    session.logged_in.should.be.true;
    session.passport.should.be.an.Object;
    done();
  });

  it('should display user\'s name and logout link if user is logged in',
      function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        res.text.should.include('Testing Tester');
        res.text.should.include('logout');
        res.text.should.not.include('login');
        done();
    });
  });

  it('should log the user out', function(done) {
    request(app)
      .get('/logout')
      .end(function (err, res) {
        if (err) return done(err);
        // Follow redirect
        request(app)
          .get('/')
          .end(function (err, res) {
            if (err) return done(err);
            res.text.should.not.include('Testing Tester');
            res.text.should.not.include('logout');
            res.text.should.include('login');
            session.logged_in.should.be.false;
            session.passport.should.be.null;
            done();
          });
      });
  });

  // TODO: Move this to an ACL Test
  it('should do something on the admin page', function(done) {
    request(app)
      .get('/admin')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.text.should.include('Administration Portals');
        done();
    });
  });

  // TODO: Move this to an ACL Test
  it('should not let someone access an admin page if not logged in',
  function(done) {
    request(app)
      .get('/logout')
      .end(function(err, res) {
        if (err) return done(err);
        request(app)
          .get('/admin')
          .end(function(err, res) {
            if (err) return done(err);
            session.logged_in.should.be.false;
            res.text.should.not.include('Administration Portals');
            res.text.should.not.include('Testing Tester');
            // Validate that an error message was flashed.
            request(app)
              .get('/')
              .end(function(err, res) {
                res.text.should.include('You should be logged in...');
                done();
              })
          });
      });
  });
});