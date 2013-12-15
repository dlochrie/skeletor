var mysql = require('mysql');
var env = process.env;
var mode = String(env.NODE_ENV || 'test').toUpperCase();

var database = env[mode + '_' + 'MYSQL_DB'];
var config = {
  host: env[mode + '_' + 'MYSQL_HOST'],
  user: env[mode + '_' + 'MYSQL_USER'],
  password: env[mode + '_' + 'MYSQL_PASS'],
  database: database
};

if (!database || !config.host || !config.user || !config.password) {
  console.log('Could not access database environmental variables.');
}

/**
 * Inititialize Client
 */
var db = mysql.createConnection(config);

db.on('error', function(err) {
  console.log('There was an error connecting to the database:\n', err);
});

if (db) {
  var users = require('./seeds/users');
  var posts = require('./seeds/posts');
  var comments = require('./seeds/comments');

  db.query('TRUNCATE user');
  console.log('Adding Fixtures for Users...');
  db.query(users);
  console.log('\t...Success.');

  db.query('TRUNCATE post');
  console.log('Adding Fixtures for Posts...');
  db.query(posts);
  console.log('\t...Success.');

  db.query('TRUNCATE comment');
  console.log('Adding Fixtures for Comments...');
  db.query(comments);
  console.log('\t...Success.');

  // Closeout.
  db.end();
}