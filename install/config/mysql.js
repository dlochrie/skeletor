var MySQLClient = require('mysql');


/**
 * Expose MySQL
 */
module.exports = MySQL;



/**
 * @constructor
 * @param {function(Object, Object, Function)} app Express application instance.
 */
function MySQL(app) {
  this.db = app.db = MySQLClient.createPool({
    database: app.get('MYSQL DB'),
    host: app.get('MYSQL HOST'),
    user: app.get('MYSQL USER'),
    password: app.get('MYSQL PASS'),
    connectionLimit: app.get('MYSQL_MAX_CONN') || 10,
    nestTables: true
  });
}


