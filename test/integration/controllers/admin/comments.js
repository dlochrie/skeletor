var request = require('supertest'),
  should = require('should');

describe('Comments Admin Controller', function() {
  var session;

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

    // it('should let a user unflag an exising comment', function(done) {
    //   request(app)
    //     .put('/admin/comments/' + TEST_USER_SLUG)
    //     .send(payload)
    //     .expect(302) // redirect
    //     .end(function(err, res) {
    //       if (err) return done(err);
    //       request(app)
    //         .get('/admin/comments')
    //         .expect(200)
    //         .end(function (err, res) {
    //           if (err) return done(err);
    //           res.text.should.include('User Successfully Updated');
    //           res.text.should.include(payload.displayName);
    //           res.text.should.not.include(TEST_USER);
    //           done();
    //         });
    //     });
    // });
  });

  describe('if a user is NOT logged in', function() {
  //   beforeEach(function(done) {
  //     app.request.session = session = new app.session();
  //     session.logout();
  //     done();
  //   });

  //   it('should NOT show the index page', function(done) {
  //     request(app)
  //       .get('/admin/comments')
  //       .expect(302)
  //       .end(function(err, res) {
  //         if (err) return done(err);
  //         res.text.should.not.include('comments administration');
  //         request(app)
  //           .get('/')
  //           .expect(200)
  //           .end(function (err, res) {
  //             res.text.should.include('This action is unauthorized.');
  //             done();
  //         });
  //       });
  //   });

  //   it('should NOT let a user create a new comment', function(done) {
  //     request(app)
  //       .post('/admin/comments')
  //       .send(payload)
  //       .expect(302) // redirect
  //       .end(function(err, res) {
  //         if (err) return done(err);
  //         request(app)
  //           .get('/')
  //           .expect(200)
  //           .end(function (err, res) {
  //             res.text.should.include('This action is unauthorized.');
  //             res.text.should.not.include('User Successfully Created');
  //             res.text.should.not.include(TEST_USER);
  //             done();
  //         });
  //       });
  //   });

  //   it('should NOT let a user edit an exising comment', function(done) {
  //     request(app)
  //       .put('/admin/comments/' + TEST_USER_SLUG)
  //       .send(payload)
  //       .expect(302) // redirect
  //       .end(function(err, res) {
  //         if (err) return done(err);
  //         request(app)
  //           .get('/')
  //           .expect(200)
  //           .end(function (err, res) {
  //             if (err) return done(err);
  //             res.text.should.include('This action is unauthorized.');
  //             res.text.should.not.include('User Successfully Updated');
  //             res.text.should.not.include(TEST_USER);
  //             done();
  //           });
  //       });
  //   });

  //   it('should NOT let a user delete an exising comment', function(done) {
  //     request(app)
  //       .del('/admin/comments/' + TEST_USER_SLUG)
  //       .expect(302) // redirect
  //       .end(function(err, res) {
  //         if (err) return done(err);
  //         request(app)
  //           .get('/')
  //           .expect(200)
  //           .end(function (err, res) {
  //             if (err) return done(err);
  //             res.text.should.include('This action is unauthorized.');
  //             res.text.should.not.include('User Successfully Deleted');
  //             res.text.should.not.include(TEST_USER);
  //             done();
  //           });
  //       });
  //   });
  });
});