var User = require('../models/user'),
    Comment = require('../models/comment'),
    crypto = require('crypto');


exports.index = function(req, res) {
  var user = new User(req.app, null);
  user.all(function(err, users) {
    if (err || !users) {
      req.flash('error', 'There was a system error. Please try again.');
      return res.redirect('/');
    }
    res.render('./users/index', {title: 'Users', users: users});
  });
};


exports.show = function(req, res) {
  var app = req.app;
  var user = new User(app, null);
  var slug = req.params.user;
  user.find({
    where: {'user.slug': slug}
  },
  function(err, user) {
    user = user[0];
    if (err || !user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }
    loadComments(app, user.user_id, function(comments) {
      getGravatarHash(user.user_email, function(hash) {
        user.gravatar = '//www.gravatar.com/avatar/' + hash + '?s=200&amp;d=mm';
        res.render('./users/show', {
          title: user.user_displayName,
          comments: comments,
          siteUser: user
        });
      });
    });
  });
};


exports.account = function(req, res) {
  var app = req.app;
  var user = res.locals.user || null;
  if (!user) {
    req.flash('error', 'You must be logged in to view your account.');
    return res.redirect('/');
  }
  loadComments(app, user.user_id, function(comments) {
    getGravatarHash(user.user_email, function(hash) {
      user.gravatar = '//www.gravatar.com/avatar/' + hash + '?s=200&amp;d=mm';
      res.render('./users/show', {
        title: 'My Account',
        comments: comments,
        siteUser: user
      });
    });
  });
};


/**
 * Load comments for a user.
 * @param app {Function} Express App function.
 * @param {number} userId User's Id.
 * @param {Function} cb The callback function to call when done.
 * @private
 */
function loadComments(app, userId, cb) {
  var comment = new Comment(app);
  comment.all({where: {'comment.user_id': userId}},
      function(err, comments) {
        if (err) comments = null;
        cb(comments);
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
  done(crypto.createHash('md5').update(email).digest('hex'));
}
