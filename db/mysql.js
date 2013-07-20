/**
 * TODO: Please see this link for POOLING and ENV Vars for Uname/Password:
 * http://stackoverflow.com/questions/16800418/how-to-properly-pass-mysql-connection-to-routes-with-express-js#answer-16800702
 */
var mysql = require('mysql');

/**
 * Set the DB Credentials in your environmental variables:
 *   Set Temporarily: 
 *   -- export MYSQL_HOST=localhost
 *   -- export etc=etc
 *   Set Permanently: (in ~/.pam_environment [ubuntu] OR ~/.bashrc)
 *   -- export MYSQL_HOST=localhost
 *   -- export etc=etc
 *
 * NOTE: Name your vars what you want, just make sure that you modify
 * the process.env.{} object to reflect that below. i.e., instead of 
 * `MYSQL_DB`, you can change to `APPNAME_DB`.
 */
var pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  connectionLimit: 10
});


/**
 * Setup MySQL Sessions, and Log Connection Info to Console
 */
 /*
pool.on('connection', function(err, connection) {
  console.log('MySQL Successfully Connected', pool)
  connection.query('SET SESSION auto_increment_increment=1')
});
*/

pool.getConnection(function(err, connection) {
  if (err) {
    console.log('There was an error connecting to the database: %', err);
  } else {
    console.log('Successfully connected to database:', process.env.MYSQL_DB);
  }
  connection.end();
});