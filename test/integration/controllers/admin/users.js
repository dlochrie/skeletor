var request = require('supertest'),
    should = require('should');

describe('Users Admin Controller', function() {
  var session;
  var TEST_USER = 'johnny edit';
  var TEST_USER_ID = 2;
  var TEST_USER_EMAIL = 'je@gmail.com';
  var TEST_USER_SLUG = 'johnny-edit';
  var payload;

  describe('if a user is logged in', function() {
    beforeEach(function(done) {
      // Refresh payload before each test.
      payload = {
        id: TEST_USER_ID,
        displayName: TEST_USER,
        email: TEST_USER_EMAIL,
        slug: TEST_USER_SLUG
      };

      // Resets the session to Logged-in.
      app.request.session = session = new app.session();
      session.logged_in.should.be.true;
      session.passport.should.be.an.Object;
      done();
    });

    it('should show the index page', function(done) {
      request(app)
        .get('/admin/users')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('users administration');
            res.text.should.include('joe tester');
            res.text.should.include('johnny edit');
            done();
          });
    });

    it('should let a user edit an exising user', function(done) {
      payload.displayName = 'edit johnny';
      payload.email = 'ej@gmail.com';

      request(app)
        .put('/admin/users/' + TEST_USER_SLUG)
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
            if (err) return done(err);
            request(app)
            .get('/admin/users')
            .expect(200)
            .end(function(err, res) {
                  if (err) return done(err);
                  res.text.should.include('User Successfully Updated');
                  res.text.should.include(payload.displayName);
                  res.text.should.not.include(TEST_USER);
                  done();
                });
          });
    });

    it('should fail to let a user edit an existing user with BAD DATA',
        function(done) {
         payload.displayName = 7777;
         payload.email = 123;

         request(app)
        .put('/admin/users/' + TEST_USER_SLUG)
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
           if (err) return done(err);
           request(app)
            .get('/admin/users')
            .expect(200)
            .end(function(err, res) {
             if (err) return done(err);
             res.text.should.not.include(TEST_USER);
             res.text.should.include(
             'There was an error editing the user: Did not pass ' +
             'validations.');
             res.text.should.not.include('User Successfully Updated');
             res.text.should.not.include(payload.displayName);
             done();
           });
         });
       });

    it('should fail to let a user edit an existing user with MISSING DATA',
        function(done) {
         payload.displayName = '';
         payload.email = '';

         request(app)
        .put('/admin/users/' + TEST_USER_SLUG)
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
           if (err) return done(err);
           request(app)
            .get('/admin/users')
            .expect(200)
            .end(function(err, res) {
             if (err) return done(err);
             res.text.should.not.include(TEST_USER);
             res.text.should.include(
             'There was an error editing the user: Did not pass ' +
             'validations.');
             res.text.should.not.include('User Successfully Updated');
             done();
           });
         });
       });

    it('should let a user delete an exising user', function(done) {
      request(app)
        .del('/admin/users/' + TEST_USER_ID)
        .expect(302) // redirect
        .end(function(err, res) {
            if (err) return done(err);
            request(app)
            .get('/admin/users')
            .expect(200)
            .end(function(err, res) {
                  if (err) return done(err);
                  res.text.should.include('User Successfully Deleted');
                  res.text.should.not.include(TEST_USER);
                  done();
                });
          });
    });

    it('should fail to let a user delete an existing user with BAD DATA',
        function(done) {
         var bad_slug = new Date().getTime().toString();
         request(app)
        .del('/admin/users/' + bad_slug)
        .expect(302) // redirect
        .end(function(err, res) {
           if (err) return done(err);
           request(app)
            .get('/admin/users')
            .expect(200)
            .end(function(err, res) {
             if (err) return done(err);
             res.text.should.not.include('User Successfully Deleted');
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
        .get('/admin/users')
        .expect(302)
        .end(function(err, res) {
            if (err) return done(err);
            res.text.should.not.include('users administration');
            request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                  res.text.should.include('This action is unauthorized.');
                  done();
                });
          });
    });

    it('should NOT let a user create a new user', function(done) {
      request(app)
        .post('/admin/users')
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
            if (err) return done(err);
            request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                  res.text.should.include('This action is unauthorized.');
                  res.text.should.not.include('User Successfully Created');
                  res.text.should.not.include(TEST_USER);
                  done();
                });
          });
    });

    it('should NOT let a user edit an exising user', function(done) {
      request(app)
        .put('/admin/users/' + TEST_USER_SLUG)
        .send(payload)
        .expect(302) // redirect
        .end(function(err, res) {
            if (err) return done(err);
            request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                  if (err) return done(err);
                  res.text.should.include('This action is unauthorized.');
                  res.text.should.not.include('User Successfully Updated');
                  res.text.should.not.include(TEST_USER);
                  done();
                });
          });
    });

    it('should NOT let a user delete an exising user', function(done) {
      request(app)
        .del('/admin/users/' + TEST_USER_SLUG)
        .expect(302) // redirect
        .end(function(err, res) {
            if (err) return done(err);
            request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                  if (err) return done(err);
                  res.text.should.include('This action is unauthorized.');
                  res.text.should.not.include('User Successfully Deleted');
                  res.text.should.not.include(TEST_USER);
                  done();
                });
          });
    });
  });
});
