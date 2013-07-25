/**
 * TODO: This can be abstracted out so that other models can use it
 */
var dbc = null;

module.exports = Post;

function Post(app, resource) {
  this.app = app;
}

/**
 * TODO: Port this to a DB Util Module
 */
function dbOpen(app) {
  app.db.getConnection(function(err, connection) {
    if (err) {
      console.log('There was an error connecting to the database:\n', err);
    } else {
      console.log('Successfully connected to database:', process.env.MYSQL_DB);
      dbc = connection;
    }
  });
}

/**
 * TODO: Port this to a DB Util Module
 */
function dbClose() {
  dbc.end();
}
  
/**
 * TODO: Abstract this out so that the table name is the only thing needed
 */  
Post.prototype.find = function find(id, cb) {
  dbOpen(this.app);
  var query = dbc.query('SELECT * FROM post WHERE id = ? LIMIT 1', id, 
      function(err, results) {
    if (err) return cb(err, null);
    return cb(null, results);
  });
  dbClose();
  console.log(query.sql);
}

Post.prototype.all = function all() {
  // Not implemented
}