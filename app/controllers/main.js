var Post = require('../models/post');


exports.index = function(req, res) {
  var post = new Post(req.app, null);
  post.latest(null, function(err, posts) {
    if (err) res.send('There was an error getting posts', err);
    if (posts) {
      res.render('main/index', {title: 'The Blog Redefined', posts: posts});
    }
  });
};


exports.about = function(req, res) {
  res.render('main/about', {title: 'About'});
};


exports.contact = function(req, res) {
  res.render('main/contact', {title: 'Contact'});
};
