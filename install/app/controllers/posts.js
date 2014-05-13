var Post = require('../models/post');


/**
 * Expose `Posts` Controller.
 */
module.exports = new Posts;



/**
 * Posts Controller.
 * @constructor
 */
function Posts() {}


/**
 * Path to posts index page.
 * @const
 * @private {string}
 */
Posts.INDEX_VIEW_ = 'posts/';


/**
 * Path to posts show view.
 * @const
 * @private {string}
 */
Posts.SHOW_VIEW_ = 'posts/show';


/**
 * Renders posts' index page - lists all posts.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Posts.prototype.index = function(req, res) {
  var post = new Post(req.app, req.body || {});
  post.find(function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the posts: ' + err);
      res.redirect(req.app.get('STATIC_ROUTES').SITE_HOME);
    } else {
      res.render(Posts.INDEX_VIEW_, {
        title: 'Latest Posts',
        description: 'Browse the latest posts.',
        results: results
      });
    }
  });
};


/**
 * Renders a post's show page - displays the post as an article.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Posts.prototype.show = function(req, res) {
  var slug = req.params.post;
  var post = new Post(req.app, slug ? {slug: slug} : {});
  post.findOne(function(err, result) {
    if (err || !result) {
      req.flash('error', 'The post you were trying to view (' + slug + ') ' +
          'was removed, or does not exist.');
      res.redirect(Posts.INDEX_VIEW_);
    } else {
      // TODO: Strip Tags from the description.
      res.render(Posts.SHOW_VIEW_, {
        title: result.post.title,
        description: result.post.description,
        result: result
      });
    }
  });
};
