var request = require('supertest'),
    should = require('should');

describe('Admin Panel Controller', function() {

  describe('if a user is logged in', function() {
    beforeEach(function(done) {
      app.request.session = session = new app.session();
      session.logged_in.should.be.true;
      session.passport.should.be.an.Object;
      done();
    });

    it('should show the admin panel index', function(done) {
      request(app)
          .get('/admin')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('Admin Panel');
            res.text.should.include('Manage Posts');
            res.text.should.include('Manage Users');
            res.text.should.include('Manage Comments');
            res.text.should.not.include('This action is unauthorized.');
            done();
          });
    });
  });

  describe('if a user is NOT logged in', function() {
    beforeEach(function(done) {
      app.request.session = session = new app.session();
      session.logout();
      done();
    });

    it('should NOT show the admin panel index', function(done) {
      request(app)
      .get('/admin')
      .expect(302)
      .end(function(err, res) {
            if (err) return done(err);
            res.text.should.not.include('Admin Panel');
            request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
                  res.text.should.not.include('Admin Panel');
                  res.text.should.not.include('Manage Posts');
                  res.text.should.not.include('Manage Posts');
                  res.text.should.not.include('Manage Users');
                  res.text.should.not.include('Manage Comments');
                  res.text.should.include('This action is unauthorized.');
                  done();
                });
          });
    });
  });
});
