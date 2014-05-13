var Post = require('../models/post');


/**
 * Expose `Main` Controller.
 */
module.exports = new Main;



/**
 * Main Controller.
 * @constructor
 */
function Main() {}


/**
 * Path to main index (home) page.
 * @const
 * @private {string}
 */
Main.INDEX_VIEW_ = 'main/index';


/**
 * Path to site about view.
 * @const
 * @private {string}s
 */
Main.ABOUT_VIEW_ = 'main/about';


/**
 * Path to site contact view.
 * @const
 * @private {string}
 */
Main.CONTACT_VIEW_ = 'main/contact';


/**
 * Path to site login view.
 * @const
 * @private {string}
 */
Main.LOGIN_VIEW_ = 'main/login';


/**
 * Renders main/home index page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Main.prototype.index = function(req, res) {
  var post = new Post(req.app);
  post.find(function(err, results) {
    if (err || !results) {
      var message = err ? err.toString() : 'No posts found.';
      req.flash('error', 'There was an error getting the posts: ' +
          message);
    }
    res.render(Main.INDEX_VIEW_, {
      title: 'Home',
      results: results
    });
  });
};


/**
 * Renders main/home about page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Main.prototype.about = function(req, res) {
  res.render(Main.ABOUT_VIEW_, {title: 'About'});
};


/**
 * Renders main/home contact page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Main.prototype.contact = function(req, res) {
  res.render(Main.CONTACT_VIEW_, {title: 'Contact'});
};


/**
 * Renders main/home login page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Main.prototype.login = function(req, res) {
  res.render(Main.LOGIN_VIEW_, {title: 'Login'});
};
