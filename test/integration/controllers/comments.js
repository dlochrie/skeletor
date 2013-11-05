var request = require('supertest'),
  should = require('should');

describe('Comments Controller', function() {
  var session;

  describe('if a user is logged in', function() {
    beforeEach(function(done) {
      app.request.session = session = new app.session();
      session.logged_in.should.be.true;
      session.passport.should.be.an.Object;
      done();
    });

    it('should show the comment form', function(done) {
      request(app)
        .get('/posts/first-post')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.include('<div class="form-actions">' +
              '<button class="btn btn-primary"><i class="icon-ok icon-white">' +
              '</i> Post Comment</button></div>');
          res.text.should.not.include(
              'You must be logged in to leave a comment.');
          done();
        });
    });

    it('should let a user create a new comment', function(done) {
      request(app)
        .post('/comments')
        .send({
          body: 'My First Comment!',
          post_id: 1,
          user_id: 1
        })
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/posts/first-post')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('Comment Successfully Created');
              res.text.should.include('My First Comment');
              done();
            });
        });
    });

    it('should show a user the flag form', function(done) {
      request(app)
        .get('/comments/1/flag')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.include(
              'Are you sure you want to flag this comment?');
          res.text.should.include('My First Comment');
          done();
        });
    });

    it('should let a user flag a comment', function(done) {
      request(app)
        .post('/comments/flag')
        .send({comment_id: 1})
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/posts/first-post')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('The comment has been flagged.');
              res.text.should.include('<p class="comment-status">' +
                  '<i class="icon-flag"></i></p>');
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

    it('should NOT show comment form', function(done) {
      request(app)
        .get('/posts/first-post')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.include('You must be logged in to leave a comment.');
          res.text.should.not.include('<div class="form-actions">' +
              '<button class="btn btn-primary"><i class="icon-ok icon-white">' +
              '</i> Post Comment</button></div>');
          done();
        });
    });

    it('should NOT let a user create a new comment', function(done) {
      request(app)
        .post('/comments')
        .send({
          body: 'My First Comment!',
          post_id: 1,
          user_id: 1
        })
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/posts/first-post')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('You should be logged in...');
              res.text.should.not.include('Comment Successfully Created');
              done();
            });
        });
    });

    it('should NOT show a user the flag form', function(done) {
      request(app)
        .get('/comments/1/flag')
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/posts/first-post')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('You should be logged in...');
              res.text.should.not.include(
                'Are you sure you want to flag this comment?');
              done();
            });
        });
    });

    it('should NOT let a user flag a comment', function(done) {
      request(app)
        .post('/comments/flag')
        .send({comment_id: 1})
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/posts/first-post')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('You should be logged in...');
              done();
            });
        });
    });
  });
});
