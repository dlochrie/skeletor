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
        req.flash('success', 'Comment Successfully Created');
        res.redirect('/admin/comments');
      }
    });
  });
};