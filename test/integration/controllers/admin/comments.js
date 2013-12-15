var request = require('supertest'),
    should = require('should');

describe('Comments Admin Controller', function() {
  var session;
  var TEST_COMMENT_ID = 1;
  var TEST_COMMENT_ALT_ID = 3;
  var TEST_USER = 'joe tester';
  var TEST_COMMENT_BODY = 'FIRST TEST COMMENT';
  var TEST_COMMENT_ALT_BODY = 'My First Comment!';

  describe('if a user is logged in', function() {
    beforeEach(function(done) {
      // Resets the session to Logged-in.
      app.request.session = session = new app.session();
      session.logged_in.should.be.true;
      session.passport.should.be.an.Object;
      done();
    });

    it('should show the index page', function(done) {
      request(app)
        .get('/admin/comments')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('comments administration');
            res.text.should.include('joe tester');
            res.text.should.include('johnny edit');
            done();
          });
    });

    it('should let a user flag an un-flagged comment', function(done) {
      request(app)
        .get('/admin/comments/' + TEST_COMMENT_ID + '/flag')
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/comments')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('Comment Successfully Flagged');
              res.text.should.include(TEST_USER);
              done();
            });
        });
    });

    it('should let a user un-flag an flagged comment', function(done) {
      request(app)
        .get('/admin/comments/' + TEST_COMMENT_ID + '/unflag')
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/comments')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('Comment Successfully Un-Flagged');
              res.text.should.include(TEST_USER);
              done();
            });
        });
    });

    it('should let a user delete an exising comment', function(done) {
      request(app)
        .del('/admin/comments/' + TEST_COMMENT_ID)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('Comment Successfully Deleted');
              res.text.should.include(TEST_USER);
              done();
            });
        });
    });
  });

  describe('if a user is NOT logged in', function() {
    beforeEach(function(done) {
      app.request.session = session = new app.session();
      session.logout();
      done();
    });

    it('should NOT show the index page', function(done) {
      request(app)
        .get('/admin/comments')
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.not.include('comments administration');
          request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
              res.text.should.include('This action is unauthorized.');
              done();
          });
        });
    });

    it('should NOT let a user flag an un-flagged comment', function(done) {
      request(app)
        .get('/admin/comments/' + TEST_COMMENT_ALT_ID + '/flag')
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.not.include('Comment Successfully Flagged');
              res.text.should.not.include(TEST_COMMENT_ALT_BODY);
              done();
            });
        });
    });

    it('should NOT let a user un-flag an flagged comment', function(done) {
      request(app)
        .get('/admin/comments/' + TEST_COMMENT_ALT_ID + '/unflag')
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.not.include('Comment Successfully Un-Flagged');
              res.text.should.not.include(TEST_COMMENT_ALT_BODY);
              done();
            });
        });
    });

    it('should NOT let a user delete an exising comment', function(done) {
      request(app)
        .del('/admin/comments/' + TEST_COMMENT_ALT_ID)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('This action is unauthorized.');
              res.text.should.not.include('Comment Successfully Deleted');
              done();
            });
        });
    });
  });
});
