var request = require('supertest'),
  should = require('should'),
  ctrl = require('../../../app/controllers/posts');

describe('Main Controller', function() {
  it('should show the home page and a few posts', function(done) {
    request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.include('A site about some stuff. We talk about ' +
              'what we do in a brief few words.');
          res.text.should.include('Description for First Post');
          res.text.should.include('Description for Second Post');
          done();
        });
  });

  it('should show the about page', function(done) {
    request(app)
        .get('/about')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.include('Skeletor: About');
          done();
        });
  });

  it('should show the contact page', function(done) {
    request(app)
        .get('/contact')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.include('Skeletor: Contact');
          done();
        });
  });
});