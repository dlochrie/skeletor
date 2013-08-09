var User = require('../models/user'),
  crypto = require('crypto');

exports.index = function(req, res) {
  var user = new User(req.app, null);
  user.all(function(err, users) {
    if (err) res.send('There was an error getting users', err);
    if (users) {
      res.render('./users/index', {title: 'Skeletor', users: users});
    }
  });
}

exports.show = function(req, res) {
  var user = new User(req.app, null);
  var id = req.params.user;
  user.find({where: {'user.id': id}}, function(err, user) {
    user = user[0];
    if (err) res.send('There was an error getting the user', err);
    if (user) {
      getGravatarHash(user.user_email, function(hash) {
        user.gravatar = '//www.gravatar.com/avatar/' + hash + '?s=200&amp;d=mm';
        res.render('./users/show', {title: 'Skeletor', user: user});
      });
    }
  });
}

/**
 * Generate a MD5 hash for retrieving a Gravatar Image.
 * According to: https://en.gravatar.com/site/implement/hash/
 * 1. Trim leading and trailing whitespace from an email address
 * 2. Force all characters to lower-case
 * 3. md5 hash the final string
 *
 * @param {string} email Email address to get hash for.
 * @param {Function} done Callback function to execute when done.
 * @private
 */
function getGravatarHash(email, done) {
  email = email.trim().toLowerCase();
  done(crypto.createHash('md5').update(email).digest("hex"));
}