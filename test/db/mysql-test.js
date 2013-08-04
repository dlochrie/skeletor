var should = require('should'),
  express = require('express'),
  app = express(),
  config = require('../../db/mysql')(app);

describe('MySQL Initialization', function() {
  beforeEach(function(done) {
    done();
  });

  it('should connect to MySQL and create a connection pool', function(done) {
    var db = app.settings.db;
    db.should.be.a('object').and.have.property('pool');
    db.should.be.a('object').and.have.property('models');
    db.pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.should.be.a('object');
      connection.end();
      done();
    });
  });

  it('should cache model definitions and table structure', function(done) {
    var db = app.settings.db;
    for (name in db.models) {
      var model = db.models[name];
      model.should.be.a('object');
      var primaryTable = model.definition.primary;
      primaryTable.should.be.equal(name);
    }
    done();
  });

  it('should cache model queries', function(done) {
    done();
  });
});