var Post = require('../../models/post'),
    markdown = require('../../../util/markdown'),
    string = require('../../../util/string');


exports.index = function(req, res) {
  var post = new Post(req.app);
  post.adminList(null, function(err, posts) {
    if (err || !posts) {
      req.flash('error', 'There was an error getting the posts: ' + err);
      return res.redirect('/admin');
    }
    res.render('admin/posts/index', {
      title: 'posts administration',
      posts: posts
    });
  });
};


exports.new = function(req, res) {
  var user = res.locals.user || null;
  var post = new Post(req.app);
  post.user_displayName = user.user_displayName;
  post.post_user_id = parseInt(user.user_id);
  res.render('admin/posts/new', {
    title: 'create post',
    post: post,
    token: res.locals.token
  });
};


exports.create = function(req, res) {
  var post = new Post(req.app, null);
  var params = req.body;
  params.body_md = params.body ? params.body.toString().trim() : '';
  params.description_md = params.description ?
      params.description.toString().trim() : '';
  params.slug = string.convertToSlug(params.title);
  markdown.convert(params, ['body', 'description'], function(params) {
    post.validate(params, function(err, resource) {
      if (err || !resource) {
        req.flash('error', 'There was an error creating the post: ' + err);
        return res.redirect('/admin/posts');
      }
      post.create({values: resource}, function(err, post) {
        if (err || !post) {
          req.flash('error', 'There was an error creating the post: ' + err);
          res.redirect('/admin/posts');
        } else {
          req.flash('success', 'Post Successfully Created');
          res.redirect('/admin/posts');
        }
      });
    });
  });
};


exports.edit = function(req, res) {
  var post = new Post(req.app, null);
  var slug = req.params.post;
  post.find({where: {'post.slug': slug}}, function(err, post) {
    if (err || !post) {
      req.flash('error', 'There was an error getting the post: ' + err);
      res.redirect('/admin/posts');
    } else {
      post = post[0];
      res.render('admin/posts/edit', {
        title: 'edit post', post: post, token: res.locals.token
      });
    }
  });
};


/**
 * Updates the post.
 * Note: The Slug will NOT be modified here so that bookmarks are persisted.
 * @param {} req
 * @param {} res
 */
exports.update = function(req, res) {
  var post = new Post(req.app, null);
  var slug = req.params.post; // Do not modify.
  var params = req.body;
  params.body_md = params.body ? params.body.toString().trim() : '';
  params.description_md = params.description ?
      params.description.toString().trim() : '';
  markdown.convert(params, ['body', 'description'], function(params) {
    post.validate(params, function(err, resource) {
      if (err) {
        req.flash('error', 'There was an error editing the post: ' + err);
        return res.redirect('/admin/posts/' + slug + '/edit');
      }
      post.update({where: {'post.slug': slug}, values: resource},
          function(err, post) {
            if (err) {
              req.flash('error', 'There was an error editing the post: ' + err);
              return res.redirect('/admin/posts/' + slug + '/edit');
            } else {
              req.flash('success', 'Post Successfully Updated');
              res.redirect('/admin/posts');
            }
          });
    });
  });
};


exports.delete = function(req, res) {
  var post = new Post(req.app, null),
      slug = req.params.post;
  post.find({where: {'post.slug': slug}}, function(err, post) {
    if (err || !post) {
      req.flash('error', 'There was an error deleting the post: ' + err);
      return res.redirect('/admin/posts');
    }
    post = post[0];
    if (post) {
      res.render('admin/posts/delete', {
        title: 'delete post', post: post, token: res.locals.token
      });
    }
  });
};


exports.destroy = function(req, res) {
  var post = new Post(req.app, null),
      slug = req.params.post;
  post.delete({where: {'post.slug': slug}}, function(err, result) {
    if (err) {
      req.flash('error', 'There was an error deleting the post: ' + err);
    } else {
      req.flash('info', 'Post Successfully Deleted.');
    }
    res.redirect('/admin/posts');
  });
};
