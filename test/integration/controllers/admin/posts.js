var request = require('supertest'),
  should = require('should');

describe('Posts Admin Controller', function() {
  var session;
  var content = new Date().getTime().toString();
  var payload = {
    title: content,
    body: content,
    description: content,
    user_id: 1
  };

  describe('if a user is logged in', function() {
    beforeEach(function(done) {
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
              res.text.should.include(content);
              done();
            });
        });
    });

    it('should let a user edit an exising post', function(done) {
      var title = new Date().getTime().toString();
      payload.title = title;
      request(app)
        .put('/admin/posts/' + content)
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
              res.text.should.include(title);
              done();
            });
        });
    });

    it('should let a user delete an exising post', function(done) {
      request(app)
        .del('/admin/posts/' + content)
        .expect(302) // redirect
        .end(function(err, res) {
          if (err) return done(err);
          request(app)
            .get('/admin/posts')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              res.text.should.include('Post Successfully Deleted');
              res.text.should.not.include(content);
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
              res.text.should.not.include(content);
              done();
          });
        });
    });

    it('should NOT let a user edit an exising post', function(done) {
      var title = new Date().getTime().toString();
      payload.title = title;
      request(app)
        .put('/admin/posts/' + content)
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
              res.text.should.not.include(title);
              done();
            });
        });
    });

    it('should NOT let a user delete an exising post', function(done) {
      request(app)
        .del('/admin/posts/' + content)
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
              res.text.should.not.include(content);
              done();
            });
        });
    });
  });
});