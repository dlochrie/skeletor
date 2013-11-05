var request = require('supertest'),
  should = require('should');

describe('Users Controller', function() {
  describe('when not logged in', function() {
    it('should show the users index', function(done) {
      request(app)
          .get('/users')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('Member Since');
            res.text.should.include('testing test');
            done();
          });
    });

    it('should show anothers user\'s page and restrict actions',
        function(done) {
      request(app)
          .get('/users/testing-test')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('testing test\'s Profile');
            res.text.should.include('testing test\'s Comments');
            res.text.should.not.include('Logout');
            res.text.should.not.include('Update Account');
            res.text.should.not.include('Delete Account');
            done();
          });
    });
  });

  describe('when logged in as the user', function() {
    beforeEach(function(done) {
      app.request.session = session = new app.session();
      session.logged_in.should.be.true;
      session.passport.should.be.an.Object;
      done();
    });

    it('should show anothers user\'s page and restrict actions',
        function(done) {
      request(app)
          .get('/users/testing-test')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('testing test\'s Profile');
            res.text.should.include('testing test\'s Comments');
            res.text.should.include('Logout');
            res.text.should.include('Update Account');
            res.text.should.include('Delete Account');
            done();
          });
    });
  });
});