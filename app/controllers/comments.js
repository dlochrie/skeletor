var Comment = require('../models/comment'),
  markdown = require('../../util/markdown');

exports.create = function(req, res) {
  var comment = new Comment(req.app, null);
  var params = req.body;
  params.body_md = params.body.toString().trim();
  markdown.convert(params, ['body'], function(params) {
    // TODO: Model Validation should replace this. This is a hack.
    delete params._csrf;
    comment.create({values: params}, function(err, comment) {
      if (err) {
        res.send(err);
      } else {
        comment = comment[0];
        req.flash('success', 'Comment Successfully Created');
        res.redirect('/posts/' + params.post_id + '#comment' +
            comment.comment_id);
      }
    });
  });
};


exports.flag = function(req, res) {
  var comment = new Comment(req.app, null);
  var id = parseInt(req.params.comment);
  var user = res.locals.user || null;
  if (!user) {
    req.flash('error', 'You must be logged in to flag a comment.');
    return res.redirect('/');
  }
  comment.find({where: {'comment.id': id}}, function(err, comment) {
    if (!err || !comment) {
      console.log('comment', comment)
      res.render('comments/flag', {
        comment: comment[0]
      });
    } else {
      req.flash('error', 'The post you were trying to flag does not exist.');
      res.redirect('/posts');
    }
  });
};


exports.flag_confirm = function(req, res) {
  var comment = new Comment(req.app, null);
  var id = parseInt(req.body.comment_id) || null;
  var user = res.locals.user || null;
  if (!user || !id) {
    req.flash('error', 'There was an error flagging this comment.');
    return res.redirect('/posts');
  }
  var params = {flagged: true};
  comment.update({where: {'comment.id': id}, values: params},
  function(err, comment) {
    if (err) {
      req.flash('error', 'The post you were trying to flag does not exist.');
      res.redirect('/');
    } else {
      comment = comment[0];
      req.flash('success', 'The comment has been flagged.');
      res.redirect('/posts/' + comment.post_id);
    }
  });
};