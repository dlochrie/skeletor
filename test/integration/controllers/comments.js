var request = require('supertest'),
  should = require('should'),
  app = require('../../../server'),
  ctrl = require('../../../app/controllers/comments');

describe('Functional Test <Sessions>:', function () {
  beforeEach(function(done) {
    /**
     * TODO: THIS IS WORKING FOR NOW FOR SESSIONS...
     */
    app.request.session = {
      passport: {
        user: {
          user_displayName:  'Testing Tester'
        }
      },
      logged_in: true
    };
    // app.res.locals.user = app.req.session.passport.user;
    console.log(app.request.session);
    done();
  });

  it('should create user session for valid user', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        console.log('err', err)
        console.log('res', res)
        // res.body.id.should.equal('1');
        // res.body.short_name.should.equal('Test user');
        // res.body.email.should.equal('user_test@example.com');
        // Save the cookie to use it later to retrieve the session
        // Cookies = res.headers['set-cookie'].pop().split(';')[0];
        // console.log(Cookies)
        done();
    });
  });
  // it('should get user session for current user', function (done) {
  //   var req = request(app).get('/v1/sessions');
  //   // Set cookie to get saved user session
  //   req.cookies = Cookies;
  //   req.set('Accept','application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .end(function (err, res) {
  //       res.body.id.should.equal('1');
  //       res.body.short_name.should.equal('Test user');
  //       res.body.email.should.equal('user_test@example.com');
  //       done();
  //     });
  // });
});


describe('GET /account', function(){
  it('should respond with json', function(done){
    request.get('/account')
      .end(function(err, response) {
        console.log('err', err)
        console.log('res', response.res)
        done();
      });
  });
});
