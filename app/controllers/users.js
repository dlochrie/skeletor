var User = require('../models/user');

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
      res.render('./users/show', {title: 'Skeletor', user: user});
    }
  });
}