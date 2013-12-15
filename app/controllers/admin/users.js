var User = require('../../models/user'),
    crypto = require('crypto'),
    string = require('../../../util/string');


exports.index = function(req, res) {
  var user = new User(req.app);
  user.all(function(err, users) {
    if (err) res.send('There was an error getting users', err);
    if (users) {
      res.render('admin/users/index', {
        title: 'users administration',
        users: users
      });
    }
  });
};


exports.edit = function(req, res) {
  var user = new User(req.app, null);
  var slug = req.params.user;
  user.find({where: {'user.slug': slug}}, function(err, user) {
    if (err || !user) {
      req.flash('error', 'There was an error getting the user: ' + err);
      res.redirect('/admin/users');
    } else {
      user = user[0];
      res.render('admin/users/edit', {
        title: 'edit user', user: user, token: res.locals.token
      });
    }
  });
};


exports.update = function(req, res) {
  var user = new User(req.app, null);
  var slug = req.params.user;
  var params = req.body;

  user.validate(params, function(err, resource) {
    if (err) {
      req.flash('error', 'There was an error editing the user: ' + err);
      return res.redirect('/admin/users/' + slug + '/edit');
    }
    user.update({where: {'user.slug': slug}, values: resource},
        function(err, post) {
          if (err) {
            req.flash('error', 'There was an error editing the user: ' + err);
            return res.redirect('/admin/users/' + slug + '/edit');
          } else {
            req.flash('success', 'User Successfully Updated');
            res.redirect('/admin/users');
          }
        });
  });
};


exports.delete = function(req, res) {
  var user = new User(req.app, null),
      id = parseInt(req.params.user);
  user.find({where: {'user.slug': slug}}, function(err, user) {
    user = user[0];
    if (err || !user) {
      req.flash('error', 'There was an error getting information for this ' +
          'user: ' + err);
      return res.redirect('/admin/users');
    }
    getGravatarHash(user.user_email, function(hash) {
      user.gravatar = '//www.gravatar.com/avatar/' + hash + '?s=200&amp;d=mm';
      res.render('admin/users/delete', {
        title: 'delete user', user: user, token: res.locals.token
      });
    });
  });
};


exports.destroy = function(req, res) {
  var user = new User(req.app, null),
      id = parseInt(req.params.user);
  user.delete({where: {'user.id': id}}, function(err, result) {
    if (err) {
      req.flash('error', 'There was an error deleting the user.');
      res.redirect('/admin/users/' + id + '/delete');
    } else {
      req.flash('info', 'User Successfully Deleted.');
      res.redirect('/admin/users');
    }
  });
};


// TODO: Gravatar Method should be put somewhere shared...


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
