var request = require('supertest'),
  should = require('should'),
  ctrl = require('../../../app/controllers/posts');

describe('Posts Controller', function() {
  var session;

  it('should show the posts index', function(done) {
    request(app)
        .get('/posts')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.include('Description for First Post');
          res.text.should.include('Description for Second Post');
          done();
        });
  });

  it('should show a post', function(done) {
    request(app)
        .get('/posts/first-post')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.include('First Post');
          res.text.should.include('testing test');
          res.text.should.include('Body for First Post');
          done();
        });
  });
});