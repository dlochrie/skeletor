var request = require('supertest'),
  should = require('should');

describe('Authentication', function() {
  var session;
  beforeEach(function(done) {
    session = app.request.session;
    done();
  });

  it('should have a valid logged in user session', function(done) {
    session.logged_in.should.be.true;
    session.passport.should.be.an.Object;
    done();
  });

  it('should create user session for valid user', function(done) {
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
  it('should not let someone do anything on the admin page if not logged in',
  function(done) {
    request(app)
      .get('/logout')
      .end(function(err, res) {
        if (err) return done(err);
        request(app)
          .get('/admin')
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('Administration Portals');
            res.text.should.not.include('Testing Tester');
            res.text.should.include('login');
            done();
          });
      });
  });
});