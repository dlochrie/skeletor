var request = require('supertest'),
    seed = require('../../util/seed');


describe('Users Controller', function() {
  before(function(done) {
    seed.init(app, 'user');
    seed.setup();
    done();
  });

  after(function(done) {
    seed.teardown();
    done();
  });

  describe('when not logged in', function() {
    it('should show the users index', function(done) {
      request(app)
          .get('/users')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('Member Since');
            res.text.should.include('joe tester');
            res.text.should.include('johnny edit');
            done();
          });
    });

    it('should show a user\'s profile page',
        function(done) {
         request(app)
          .get('/users/joe-tester')
          .expect(200)
          .end(function(err, res) {
           if (err) return done(err);
           res.text.should.include('joe tester\'s Profile');
           done();
         });
       });
  });

  describe('when logged in as the user', function() {
    beforeEach(function(done) {
      var session = app.request.session = new app.session();
      session.logged_in.should.be.true;
      session.passport.should.be.an.Object;
      done();
    });

    it('should show the logged in user\'s page with custom actions',
       function(done) {
         // TODO: Implement.
         done();
       });

    it('should show anothers user\'s page and restrict actions',
       function(done) {
         // TODO: Implement.
         done();
       });
  });
});
