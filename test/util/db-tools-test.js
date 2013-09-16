var should = require('should'),
  tools = require('../../util/db-tools');

describe('DB Tools', function() {
  beforeEach(function(done) {
    var modelOne = [
      "field1",
      "field2",
      "modelTwo_id"
    ];

    var modelTwo = [
      "id",
      "field1"
    ];

    var modelThree = [
      "id",
      "modelOne_id",
      "field1"
    ];

    struct_a = {
      "primary": "modelOne",
      "columns": {
        "modelOne": modelOne,
        "modelTwo": modelTwo
      }
    };

    struct_b = {
      "primary": "modelOne",
      "columns": {
        "modelOne": modelOne,
        "modelTwo": modelTwo,
        "modelThree": modelThree
      }
    };

    joins_a = [{
      "relation": "modelTwo",
      "relation key": "id",
      "foreign key": "modelTwo_id"
    }];

    joins_b = [{
      "relation": "modelTwo",
      "relation key": "id",
      "foreign key": "modelTwo_id"
    },{
      "relation": "modelThree",
      "relation key": "ModelOne_id",
      "foreign key": "id"
    },];

    done();
  });

  it('should prepare a select statement without joins and without params',
      function(done) {
    var expected = 'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' +
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1` ' +
        'FROM `modelOne` WHERE ?';
    var query = tools.prepareSelect(struct_a, null);
    query.should.equal(expected);
    done();
  });

  it('should prepare a select statement without joins and with params',
      function(done) {
    var expected = 'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' +
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1` ' +
        'FROM `modelOne` WHERE `field1` = `red` AND `field2` = `blue` LIMIT 1';
    var query = tools.prepareSelect(struct_a, {limit: 1,
        where: {field1: 'red', field2: 'blue'}});
    query.should.equal(expected);
    done();
  });

  it('should prepare a select statement with joins and without params',
      function(done) {
    var expected = 'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' +
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1` ' +
        'FROM `modelOne` JOIN `modelTwo` ON `modelTwo`.`id` = ' +
        '`modelOne`.`modelTwo_id` WHERE ?';
    struct_a.joins = joins_a;
    var query = tools.prepareSelect(struct_a, null);
    query.should.equal(expected);
    done();
  });

  it('should prepare a select statement with joins and with params',
      function(done) {
    var expected = 'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' +
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1` ' +
        'FROM `modelOne` JOIN `modelTwo` ON `modelTwo`.`id` = ' +
        '`modelOne`.`modelTwo_id` WHERE ? LIMIT 1';
    struct_a.joins = joins_a;
    var query = tools.prepareSelect(struct_a, {limit: 1});
    query.should.equal(expected);
    done();
  });

  it('should prepare a select statement with multiple joins and without params',
      function(done) {
    var expected =  'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' +
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1`, ' +
        '`modelThree`.`id`, `modelThree`.`modelOne_id`, ' +
        '`modelThree`.`field1` FROM `modelOne` JOIN `modelTwo` ON ' +
        '`modelTwo`.`id` = `modelOne`.`modelTwo_id` ' +
        'JOIN `modelThree` ON `modelThree`.`ModelOne_id` = ' +
        '`modelOne`.`id` WHERE ?';
    struct_b.joins = joins_b;
    var query = tools.prepareSelect(struct_b, null);
    query.should.equal(expected);
    done();
  });

  it('should prepare a select statement with multiple joins and with params',
      function(done) {
    var expected =  'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' +
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1`, ' +
        '`modelThree`.`id`, `modelThree`.`modelOne_id`, ' +
        '`modelThree`.`field1` FROM `modelOne` JOIN `modelTwo` ON ' +
        '`modelTwo`.`id` = `modelOne`.`modelTwo_id` ' +
        'JOIN `modelThree` ON `modelThree`.`ModelOne_id` = ' +
        '`modelOne`.`id` WHERE ? LIMIT 1';
    struct_b.joins = joins_b;
    var query = tools.prepareSelect(struct_b, {limit: 1});
    query.should.equal(expected);
    done();
  });

  it('should prepare an insert statement without params',
      function(done) {
    var expected =  'INSERT INTO `modelOne` SET ?';
    var query = tools.prepareInsert(struct_a, null);
    query.should.equal(expected);
    done();
  });

  it('should prepare an insert statement with params',
      function(done) {
    var expected =  'INSERT INTO `modelOne` SET ? LIMIT 1';
    var query = tools.prepareInsert(struct_a, {limit: 1});
    query.should.equal(expected);
    done();
  });

  it('should prepare an update statement without params',
      function(done) {
    var expected =  'UPDATE `modelOne` SET ? WHERE ?';
    var query = tools.prepareUpdate(struct_a, null);
    query.should.equal(expected);
    done();
  });

  it('should prepare an update statement with params',
      function(done) {
    var expected =  'UPDATE `modelOne` SET ? WHERE ? LIMIT 5';
    var query = tools.prepareUpdate(struct_a, {
        limit: 5, where: {modelOne_id: 1}});
    query.should.equal(expected);
    done();
  });

  it('should prepare an delete statement without params',
      function(done) {
    var expected =  'DELETE FROM `modelOne` WHERE ? LIMIT 1';
    var query = tools.prepareDelete(struct_a, null);
    query.should.equal(expected);
    done();
  });

  it('should prepare an delete statement with params',
      function(done) {
    var expected =  'DELETE FROM `modelOne` WHERE ? LIMIT 5';
    var query = tools.prepareDelete(struct_a, {limit: 5});
    query.should.equal(expected);
    done();
  });
});