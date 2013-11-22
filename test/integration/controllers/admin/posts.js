var request = require('supertest'),
  should = require('should');

describe('Posts Admin Controller', function() {
  var session;
  var TEST_CONTENT = 'Test Content';
  var TEST_CONTENT_SLUG = 'test-content';
  var payload;

  describe('if a user is logged in', function() {
    beforeEach(function(done) {
      // Refresh payload before each test.
      payload = {
        title: TEST_CONTENT,
        body: TEST_CONTENT,
        description: TEST_CONTENT,
        user_id: 1
      };

      // Resets the session to Logged-in.
      app.request.session = session = new app.session();
      session.logged_in.should.be.true;
      session.passport.should.be.an.Object;
      done();
    });

    it('should show the index page', function(done) {
      request(app)
        .get('/admin/posts')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.include('posts administration');
          res.text.should.include('First Post');
          res.text.should.include('Second Post');
          done();
        });
    });

    it('should let a user create a new post', function(done) {
      request(app)
        .post('/admin/posts')
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/posts')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('Post Successfully Created');
              res.text.should.include(TEST_CONTENT);
              done();
            });
        });
    });

    it('should fail to let a user create a new post with BAD DATA',
        function(done) {
      payload.title = 123;
      payload.body = 123;
      payload.user_id = 'not a number';

      request(app)
        .post('/admin/posts')
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/posts')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include(
                  'There was an error creating the post: Did not pass ' +
                  'validations.');
              res.text.should.not.include('Post Successfully Created');
              done();
            });
        });
    });

    it('should fail to let a user create a new post with MISSING DATA',
        function(done) {
      payload.title = null;
      payload.body = null;
      payload.user_id = null;

      request(app)
        .post('/admin/posts')
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/posts')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include(
                  'There was an error creating the post: Did not pass ' +
                  'validations.');
              res.text.should.not.include('Post Successfully Created');
              done();
            });
        });
    });

    it('should let a user edit an exising post', function(done) {
      payload.title = 'Updated Title';
      payload.body = 'Updated Body';
      payload.user_id = 1;

      request(app)
        .put('/admin/posts/' + TEST_CONTENT_SLUG)
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/posts')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('Post Successfully Updated');
              res.text.should.include(payload.title);
              res.text.should.not.include(TEST_CONTENT);
              done();
            });
        });
    });

    it('should fail to let a user edit an existing post with BAD DATA',
        function(done) {
      payload.title = 123;
      payload.body = 123;
      payload.user_id = 'string';

      request(app)
        .put('/admin/posts/' + TEST_CONTENT_SLUG)
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/posts')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include(
                  'There was an error editing the post: Did not pass ' +
                  'validations.');
              res.text.should.not.include('Post Successfully Updated');
              res.text.should.not.include(payload.title);
              done();
            });
        });
    });

    it('should let a user delete an exising post', function(done) {
      request(app)
        .del('/admin/posts/' + TEST_CONTENT_SLUG)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/posts')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('Post Successfully Deleted');
              res.text.should.not.include(TEST_CONTENT);
              done();
            });
        });
    });

    it('should fail to let a user delete an existing post with BAD DATA',
        function(done) {
      var bad_slug = new Date().getTime().toString();
      request(app)
        .del('/admin/posts/' + bad_slug)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/posts')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.not.include('Post Successfully Deleted');
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
        .get('/admin/posts')
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.not.include('posts administration');
          request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
              res.text.should.include('This action is unauthorized.');
              done();
          });
        });
    });

    it('should NOT let a user create a new post', function(done) {
      request(app)
        .post('/admin/posts')
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
              res.text.should.include('This action is unauthorized.');
              res.text.should.not.include('Post Successfully Created');
              res.text.should.not.include(TEST_CONTENT);
              done();
          });
        });
    });

    it('should NOT let a user edit an exising post', function(done) {
      request(app)
        .put('/admin/posts/' + TEST_CONTENT_SLUG)
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('This action is unauthorized.');
              res.text.should.not.include('Post Successfully Updated');
              res.text.should.not.include(TEST_CONTENT);
              done();
            });
        });
    });

    it('should NOT let a user delete an exising post', function(done) {
      request(app)
        .del('/admin/posts/' + TEST_CONTENT_SLUG)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('This action is unauthorized.');
              res.text.should.not.include('Post Successfully Deleted');
              res.text.should.not.include(TEST_CONTENT);
              done();
            });
        });
    });
  });
});