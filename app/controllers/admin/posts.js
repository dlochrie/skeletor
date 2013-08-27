var Post = require('../../models/post'),
  markdown = require('../../../util/markdown');

exports.index = function(req, res) {
  var post = new Post(req.app);
  post.all(function(err, posts) {
    if (err) res.send('There was an error getting posts', err);
    if (posts) {
      res.render('admin/posts/index', {title: 'Posts Administration', posts: posts});
    }
  });
};


exports.new = function(req, res) {
  var post = new Post(req.app);
  var user = res.locals.user || null;
  if (!user) {
    req.flash('error', 'You should be logged in...');
    return res.redirect('/');
  }
  post.user_displayName = user.user_displayName;
  post.post_user_id = parseInt(user.user_id);
  res.render('admin/posts/new', {
    title: 'Create Post',
    post: post,
    token: res.locals.token
  });
};


exports.create = function(req, res) {
  var post = new Post(req.app, null);
  var params = req.body;
  params.body_md = params.body.toString().trim();
  params.description_md = params.description.toString().trim();
  markdown.convert(params, ['body', 'description'], function(params) {
    // TODO: Model Validation should replace this. This is a hack.
    delete params._csrf;
    post.create({values: params}, function(err, post) {
      if (err) {
        res.send(err);
      } else {
        req.flash('success', 'Post Successfully Created');
        res.redirect('/admin/posts');
      }
    });
  });
};


exports.edit = function(req, res) {
  var post = new Post(req.app, null);
  // TODO: Make sure all IDs are being parsed as integers....
  var id = parseInt(req.params.post);
  post.find({where: {'post.id': id}}, function(err, post) {
    post = post[0];
    if (err) res.send('There was an error getting the post', err);
    if (post) {
      res.render('admin/posts/edit', {
        title: 'Post Edit', post: post, token: res.locals.token
      });
    }
  });
};


exports.update = function(req, res) {
  var post = new Post(req.app, null);
  var id = parseInt(req.params.post);
  var params = req.body;
  params.body_md = params.body.toString().trim();
  params.description_md = params.description.toString().trim();
  markdown.convert(params, ['body', 'description'], function(params) {
    delete params._csrf;
    post.update({where: {'post.id': id}, values: params}, function(err, post) {
      if (err) {
        res.send(err);
      } else {
        req.flash('success', 'Post Successfully Updated');
        res.redirect('/admin/posts/' + id + '/edit');
      }
    });
  });
};


exports.delete = function(req, res) {
  var post = new Post(req.app, null),
    id = parseInt(req.params.post);
  post.find({where: {'post.id': id}}, function(err, post) {
    post = post[0];
    if (err) res.send('There was an error getting the post', err);
    if (post) {
      res.render('admin/posts/delete', {
        title: 'Post Delete', post: post, token: res.locals.token
      });
    }
  });
};


exports.destroy = function(req, res) {
  var post = new Post(req.app, null),
    id = parseInt(req.params.post);
  post.delete({where: {'post.id': id}}, function(err, result) {
    if (err) {
      req.flash('error', 'There was an error deleting the post.');
      res.redirect('/admin/posts/' + id + '/delete');
    } else {
      req.flash('info', 'Post Successfully Deleted.');
      res.redirect('/admin/posts');
    }
  });
};