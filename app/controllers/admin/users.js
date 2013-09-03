var User = require('../../models/user'),
  crypto = require('crypto');


exports.index = function(req, res) {
  var user = new User(req.app);
  user.all(function(err, users) {
    if (err) res.send('There was an error getting users', err);
    if (users) {
      res.render('admin/users/index', {
        title: 'Users Administration',
        users: users
      });
    }
  });
};


exports.edit = function(req, res) {
  var user = new User(req.app, null);
  var id = parseInt(req.params.user);
  user.find({where: {'user.id': id}}, function(err, user) {
    user = user[0];
    if (err) res.send('There was an error getting the user', err);
    if (user) {
      res.render('admin/users/edit', {
        title: 'User Edit', user: user, token: res.locals.token
      });
    }
  });
};


exports.update = function(req, res) {
  var user = new User(req.app, null);
  var id = parseInt(req.params.user);
  var params = req.body;
  delete params._csrf;
  user.update({where: {'user.id': id}, values: params}, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      req.flash('success', 'User Successfully Updated');
      res.redirect('/admin/users/' + id + '/edit');
    }
  });
};


exports.delete = function(req, res) {
  var user = new User(req.app, null),
    id = parseInt(req.params.user);
  user.find({where: {'user.id': id}}, function(err, user) {
    user = user[0];
    if (err) res.send('There was an error getting the user', err);
    if (user) {
      getGravatarHash(user.user_email, function(hash) {
        user.gravatar = '//www.gravatar.com/avatar/' + hash + '?s=200&amp;d=mm';
        res.render('./users/show', {title: 'Skeletor', user: user});
      });
      res.render('admin/users/delete', {
        title: 'User Delete', user: user, token: res.locals.token
      });
    }
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
  done(crypto.createHash('md5').update(email).digest("hex"));
}