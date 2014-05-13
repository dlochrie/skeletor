var express = require('express'),
    app = express(),
    should = require('should');


// NOTE: If you are FAILING in any of these tests, please make sure you have set
// the proper environmental variables, as seen in core/environment.js.
describe('Core environment module', function() {
  before(function() {
    require('../../../core/environment')(app);
  });

  describe('environmental variables', function() {
    it('should retrieve the environmental variables and make sure the ' +
        'NODE_ENV is defined',
        function() {
          var env = process.env.NODE_ENV;
          env.should.be.type('string');
          env.should.be.ok;
        });
  });

  describe('application settings', function() {
    it(
       'should provide default application-specific settings based on the ' +
       'current environment',
       function() {
         app.get('NODE ENVIRONMENT').should.be.type('string');
         app.get('NODE PORT').should.be.type('number');
         app.get('NODE HOST').should.be.type('string');
         app.get('ROOT PATH').should.be.type('string');
         app.get('ROOT URL').should.be.type('string');
         app.get('MYSQL DB').should.be.type('string');
         app.get('MYSQL HOST').should.be.type('string');
         app.get('MYSQL USER').should.be.type('string');
         app.get('MYSQL PASS').should.be.type('string');
         app.get('MYSQL MAX CONN').should.be.type('number');
         app.get('COOKIE SECRET').should.be.type('string');
         app.get('REDIS SECRET').should.be.type('string');
       });

    it('should store a list of site owners', function() {
      app.get('SITE OWNERS').should.be.an.Array;
    });

    it(
       'sets the default view engine to Jade, and defines a view directory',
       function() {
         app.get('views').should.equal(app.get('ROOT PATH') + '/app/views');
         app.get('view engine').should.equal('jade');
       });
  });
});
