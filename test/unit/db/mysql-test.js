var should = require('should'),
  express = require('express');

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
      model.definition.should.be.a('object');
      var primaryTable = model.definition.primary;
      primaryTable.should.be.equal(name);
    }
    done();
  });

  it('should cache model queries', function(done) {
    var db = app.settings.db;
    for (name in db.models) {
      var model = db.models[name];
      model.queries.should.be.a('object');
      // More verbose SQL tests should go in `db-tools-test.js`.
      // These test for existence of statement, and not its accuracy.
      model.queries['all'].should.include('SELECT');
      model.queries['create'].should.include('INSERT');
      model.queries['delete'].should.include('DELETE');
    }
    done();
  });
});