var express = require('../node_modules/express'),
  mysql = require('../node_modules/mysql'),
  table;

var env = process.env;
var mode = String(env.NODE_ENV || 'dev').toUpperCase();

var database = env[mode + '_' + 'MYSQL_DB'];
var config = {
  host: env[mode + '_' + 'MYSQL_HOST'],
  user: env[mode + '_' + 'MYSQL_USER'],
  password: env[mode + '_' + 'MYSQL_PASS']
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

/**
 * Create Database
 */
console.log('Creating database `' + database + '`');
db.query('CREATE DATABASE IF NOT EXISTS `' + database + '`');
db.query('USE `' + database + '`');

/**
 * Create Tables
 */

/** Posts */
table = 'post';
console.log('Creating table `' + table + '`');
db.query('DROP TABLE IF EXISTS ' + table);
db.query('CREATE TABLE ' + table + ' (' +
  'id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,' +
  'user_id INT(10) UNSIGNED NOT NULL,' +
  'title VARCHAR(255) NOT NULL,' +
  'slug VARCHAR(255) NOT NULL,' +
  'description TEXT NOT NULL,' +
  'description_md TEXT NOT NULL,' +
  'body TEXT NOT NULL,' +
  'body_md TEXT NOT NULL,' +
  'created DATETIME NOT NULL,' +
  'updated DATETIME NOT NULL,' +
  'PRIMARY KEY(id),' +
  'UNIQUE(title),' +
  'INDEX(user_id))');

/** Users */
table = 'user';
console.log('Creating table `' + table + '`');
db.query('DROP TABLE IF EXISTS ' + table);
db.query('CREATE TABLE ' + table + ' (' +
  'id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,' +
  'displayName VARCHAR(100) NOT NULL,' +
  'slug VARCHAR(100) NOT NULL,' +
  'email VARCHAR(100) NOT NULL,' +
  'google_id VARCHAR(100),' +
  'facebook_id VARCHAR(100),' +
  'twitter_id VARCHAR(100),' +
  'created DATETIME NOT NULL,' +
  'updated DATETIME NOT NULL,' +
  'PRIMARY KEY(id),' +
  'UNIQUE(displayName),' +
  'UNIQUE(email))');

/** Comments */
table = 'comment';
console.log('Creating table `' + table + '`');
db.query('DROP TABLE IF EXISTS ' + table);
db.query('CREATE TABLE ' + table + ' (' +
  'id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,' +
  'user_id INT(10) UNSIGNED NOT NULL,' +
  'post_id INT(10) UNSIGNED NOT NULL,' +
  'body TEXT NOT NULL,' +
  'body_md TEXT NOT NULL,' +
  'flagged TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,' +
  'created DATETIME NOT NULL,' +
  'updated DATETIME NOT NULL,' +
  'PRIMARY KEY(id),' +
  'INDEX(user_id),' +
  'INDEX(post_id))');

/** Categories */

/** Tags */

/**
 * Close Connection
 */
db.end();