var request = require('supertest'),
  should = require('should'),
  app = require('../../../server'),
  ctrl = require('../../../app/controllers/comments');

describe('Functional Test <Sessions>:', function () {
  beforeEach(function(done) {
    /**
     * TODO: THIS IS WORKING FOR NOW FOR SESSIONS...
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
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var session = request.text;
        res.text.should.include('Testing Tester');
        res.text.should.not.include('login');
        done();
    });
  });

  it('should do something on the admin page', function (done) {
    request(app)
      .get('/admin')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        var session = request.text;
        res.text.should.include('Administration Portals');
        done();
    });
  });

  it('should log the user out', function (done) {
    request(app)
      .get('/logout')
      .end(function (err, res) {
        if (err) return done(err);
        request(app)
          .get('/')
          .end(function (err, res) {
            if (err) return done(err);
            res.text.should.not.include('Testing Tester');
            res.text.should.include('login');
            done();
          });
      });
  });

});
