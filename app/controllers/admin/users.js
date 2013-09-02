var User = require('../../models/user'),
  markdown = require('../../../util/markdown');

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