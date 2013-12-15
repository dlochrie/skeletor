var Comment = require('../../models/comment'),
  markdown = require('../../../util/markdown'),
  string = require('../../../util/string');


exports.index = function(req, res) {
  var comment = new Comment(req.app);
  comment.all(null, function(err, comments) {
    if (err || !comments) {
      req.flash('error', 'There was an error getting the comments: ' + err);
      return res.redirect('/admin');
    }
    res.render('admin/comments/index', {
      title: 'comments administration',
      comments: comments
    });
  });
};


exports.flag = function(req, res) {
  var comment = new Comment(req.app, null),
    id = parseInt(req.params.comment);
  comment.update({where: {'comment.id': id}, values: {flagged: true}}, 
      function(err, result) {
        if (err) {
          req.flash('error', 'There was an error flagging the comment: ' + err);
        } else {
          req.flash('info', 'Comment Successfully Flagged.');
        }
        res.redirect('/admin/comments');
      });
};


exports.unflag = function(req, res) {
  var comment = new Comment(req.app, null),
    id = parseInt(req.params.comment);
  comment.update({where: {'comment.id': id}, values: {flagged: false}}, 
      function(err, result) {
        if (err) {
          req.flash('error', 'There was an error un-flagging the comment: ' +
              err);
        } else {
          req.flash('info', 'Comment Successfully Un-Flagged.');
        }
        res.redirect('/admin/comments');
      });
};


exports.delete = function(req, res) {
  var comment = new Comment(req.app, null),
    id = parseInt(req.params.comment);
  comment.find({where: {'comment.id': id}}, function(err, comment) {
    if (err || !comment) {
      req.flash('error', 'There was an error deleting the comment: ' + err);
      return res.redirect('/admin/comments');
    }
    comment = comment[0];
    if (comment) {
      res.render('admin/comments/delete', {
        title: 'delete comment', comment: comment, token: res.locals.token
      });
    }
  });
};


exports.destroy = function(req, res) {
  var comment = new Comment(req.app, null),
    id = parseInt(req.params.comment);
  comment.delete({where: {'comment.id': id}}, function(err, result) {
    if (err) {
      req.flash('error', 'There was an error deleting the comment: ' + err);
    } else {
      req.flash('info', 'Comment Successfully Deleted.');
    }
    res.redirect('/admin/comments');
  });
};