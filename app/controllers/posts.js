var Post = require('../models/post');

exports.index = function(req, res) {
  var post = new Post(req.app, null);
  post.all(function(err, posts) {
    if (err) res.send('There was an error getting posts', err);
    if (posts) {
      res.render('posts/index', { title: 'Skeletor', posts: posts});
    }
  });
}

exports.show = function(req, res) {
  var post = new Post(req.app, null);
  var id = req.params.post;
  post.find({'post.id': id}, function(err, post) {
    post = post[0];
    if (err) res.send('There was an error getting the post', err);
    if (post) {
      res.render('posts/show', { title: 'Skeletor', post: post});
    }
  });
}