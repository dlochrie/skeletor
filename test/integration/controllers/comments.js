var request = require('supertest'),
  should = require('should'),
  ctrl = require('../../../app/controllers/comments');

describe('Comments Controller', function () {
  var session;

  beforeEach(function(done) {
    app.request.session = new app.session();
    session = app.request.session;
    session.logged_in.should.be.true;
    session.passport.should.be.an.Object;
    done();
  });

  it('should create a new comment if the user is logged in', function(done) {
    request(app)
      .get('/posts/first-post')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        request(app)
          .post('/comments')
          .send({
            body: 'My First Comment!',
            post_id: 1,
            user_id: 1
          })
          .expect(302)
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
          })
      });
  });
});
