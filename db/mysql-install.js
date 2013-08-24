var express = require('../node_modules/express')
  , mysql = require('../node_modules/mysql')
  , database = process.env.MYSQL_DB
  , table;

var config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS
};

/**
 * Init Client
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
  'displayName VARCHAR(100),' +
  'email VARCHAR(100),' +
  'google_id VARCHAR(100),' +
  'facebook_id VARCHAR(100),' +
  'twitter_id VARCHAR(100),' +
  'created DATETIME NOT NULL,' +
  'updated DATETIME NOT NULL,' +
  'PRIMARY KEY(id),' +
  'UNIQUE(displayName),' +
  'UNIQUE(email))');

/** Comments */

/** Categories */

/** Tags */

/**
 * Close Connection
 */
db.end();