var Post = require('../../models/post');

exports.index = function(req, res) {
  var post = new Post(req.app, null);
  post.all(function(err, posts) {
    if (err) res.send('There was an error getting posts', err);
    if (posts) {
      res.render('admin/posts/index', {title: 'Posts Administration', posts: posts});
    }
  });
};


exports.edit = function(req, res) {
  var post = new Post(req.app, null);
  var id = req.params.post;
  post.find({where: {'post.id': id}}, function(err, post) {
    post = post[0];
    if (err) res.send('There was an error getting the post', err);
    if (post) {
      res.render('admin/posts/edit', {title: 'Post Edit', post: post, token:res.locals.token});
    }
  });
}


exports.update = function(req, res) {
  var post = new Post(req.app, null);
  var id = req.params.post;
  var params = req.body;
  post.update({where: {'post.id': id}}, function(err, post) {
    // TODO: Handle Update Safely, and return with success message.
  });
};