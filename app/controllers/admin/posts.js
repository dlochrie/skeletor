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
  // TODO: Make sure all IDs are being parsed as integers....
  var id = parseInt(req.params.post);
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
  var id = parseInt(req.params.post);
  var params = req.body;
  markDownPost(params, ['body', 'description'], function(err, body) {
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


/**
 * Perform Markdown Conversion on Selected Fields.
 * TODO: This should be a SHARED Method
 * @param {Object} params Request parameters.
 * @param {Array.string} fields Parameters which will be converted.
 * @param {Function} done Callback function.
 */
function markDownPost(params, fields, done) {
  var md = require('marked'),
    opts = {};

  function reformat(field) {
    if (params[field]) {
      md(params[field].toString(), opts, function(err, out) {
        params[field] = (err) ? params.field : out;
        reformat(fields.shift())
      });
    } else {
      done(params);
    }
  }

  reformat(fields.shift());
}