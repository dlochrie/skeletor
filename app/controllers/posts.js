var Post = require('../models/post'),
    Comment = require('../models/comment');


exports.index = function(req, res) {
  var post = new Post(req.app, null);
  post.latest(null, function(err, posts) {
    if (err) return res.send('There was an error getting posts', err);
    if (posts) {
      res.render('posts/index', {title: 'Skeletor', posts: posts});
    }
  });
};


exports.show = function(req, res) {
  var post = new Post(req.app, null);
  var slug = req.params.post;
  post.find({where: {'post.slug': slug}}, function(err, post) {
    post = post[0] || null;
    if (err || !post) {
      return res.send(404);
    }
    var comment = new Comment(req.app, null);
    comment.all({where: {'post_id': post.post_id}}, function(err, comments) {
      res.render('posts/show', {
        title: 'Skeletor',
        post: post,
        comments: comments,
        token: res.locals.token
      });
    });
  });
};
