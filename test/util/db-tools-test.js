var should = require('should'),
  tools = require('../../util/db-tools');

describe('DB Tools', function() {

  // TODO: 
  // See about cloning the `struct` and `joins` to reduce code here.
  beforeEach(function (done) {
    struct = {
      "primary": "modelOne",
      "columns": {
        "modelOne": [
          "field1", 
          "field2", 
          "modelTwo_id"  
        ],
        "modelTwo": [
          "id",
          "field1"
        ]
      }
    };

    struct2 = {
      "primary": "modelOne",
      "columns": {
        "modelOne": [
          "field1", 
          "field2", 
          "modelTwo_id"  
        ],
        "modelTwo": [
          "id",
          "field1"
        ],
        "modelThree": [
          "id",
          "modelOne_id",
          "field1"
        ]
      }
    };

    joins = [{
      "relation": "modelTwo",
      "relation key": "id",
      "foreign key": "modelTwo_id"
    }];

    joins2 = [{
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
    var params = null;
    var expected = 'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' + 
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1` ' + 
        'FROM modelOne';
    var query = tools.prepareSelect(struct, params);
    query.should.equal(expected);
    done();
  });


  it('should prepare a select statement without joins and with params', 
      function(done) {
    var params = { limit: 1};
    var expected = 'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' + 
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1` ' + 
        'FROM modelOne LIMIT 1';
    var query = tools.prepareSelect(struct, params);
    query.should.equal(expected);
    done();
  });


  it('should prepare a select statement with joins and without params', 
      function(done) {

    var params = null;
    var expected = 'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' + 
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1` ' + 
        'FROM modelOne JOIN `modelTwo` ON `modelTwo`.`id` = ' + 
        '`modelOne`.`modelTwo_id`';
    struct.joins = joins;
    var query = tools.prepareSelect(struct, params);
    query.should.equal(expected);
    done();
  });


  it('should prepare a select statement with joins and with params', 
      function(done) {
    var params = { limit: 1};
    var expected = 'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' + 
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1` ' + 
        'FROM modelOne JOIN `modelTwo` ON `modelTwo`.`id` = ' + 
        '`modelOne`.`modelTwo_id` LIMIT 1';
    struct.joins = joins;
    var query = tools.prepareSelect(struct, params);
    query.should.equal(expected);
    done();
  });

  it('should prepare a select statement with joins and with params', 
      function(done) {
    var params = { limit: 1};
    var expected =  'SELECT `modelOne`.`field1`, `modelOne`.`field2`, ' + 
        '`modelOne`.`modelTwo_id`, `modelTwo`.`id`, `modelTwo`.`field1`, ' + 
        '`modelThree`.`id`, `modelThree`.`modelOne_id`, ' + 
        '`modelThree`.`field1` FROM modelOne JOIN `modelTwo` ON ' + 
        '`modelTwo`.`id` = `modelOne`.`modelTwo_id`,  ' +  
        'JOIN `modelThree` ON `modelThree`.`ModelOne_id` = ' + 
        '`modelOne`.`id` LIMIT 1';
    struct2.joins = joins2;
    var query = tools.prepareSelect(struct2, params);
    query.should.equal(expected);
    done();
  });

});