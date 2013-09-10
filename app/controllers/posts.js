var Post = require('../models/post'),
  Comment = require('../models/comment');

exports.index = function(req, res) {
  var post = new Post(req.app, null);
  post.latest(null, function(err, posts) {
    if (err) res.send('There was an error getting posts', err);
    if (posts) {
      res.render('posts/index', {title: 'Skeletor', posts: posts});
    }
  });
};


exports.show = function(req, res) {
  var post = new Post(req.app, null);
  // TODO: Make sure all IDs are being parsed as integers....
  var id = parseInt(req.params.post);
  post.find({where: {'post.id': id}}, function(err, post) {
    post = post[0] || null;
    if (err || !post) res.send('There was an error getting the post', err);
    var comment = new Comment(req.app, null);
    comment.all({where: {'post_id': id}}, function(err, comments) {
      res.render('posts/show', {
        title: 'Skeletor',
        post: post,
        comments: comments,
        token: res.locals.token
      });
    });
  });
};


exports.comments = function(req, res) {
  var comment = new Comment(req.app, null);
  var id = parseInt(req.params.post);
  comment.all({where: {'post_id': id}}, function(err, comments) {
    if (err) return next();
    res.json(comments);
  });
};