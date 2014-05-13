var User = require('../models/user');


/**
 * Expose `Users` Controller.
 */
module.exports = new Users;



/**
 * Users Controller.
 * @constructor
 */
function Users() {}


/**
 * Path to users index page.
 * @const
 * @private {string}
 */
Users.INDEX_VIEW_ = 'users/';


/**
 * Path to users show view.
 * @const
 * @private {string}
 */
Users.SHOW_VIEW_ = 'users/show';


/**
 * Quick and easy authorization for an administrator. Flashes a message and
 * redirects a user to the home page if they are not logged in.
 * For now, ONLY a SITE_OWNER can be authorized.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 * @param {Function} next Express callback function.
 */
Users.prototype.authenticate = function(req, res, next) {
  var user = res.locals.user || null;
  var owners = req.app.get('SITE OWNERS') || [];
  if (user && (owners.indexOf(user.email) !== -1)) {
    next();
  } else {
    req.flash('error', 'This action is unauthorized.');
    res.redirect('/');
  }
};


/**
 * Renders users' index page - lists all users.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Users.prototype.index = function(req, res) {
  var user = new User(req.app, req.body || {});
  user.find(function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the users: ' + err);
      res.redirect(req.app.get('STATIC_ROUTES').SITE_HOME);
    } else {
      res.render(Users.INDEX_VIEW_, {
        title: 'Listing Users',
        description: 'Browse Site Users',
        results: results
      });
    }
  });
};


/**
 * Renders a users's "show" page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Users.prototype.show = function(req, res) {
  var slug = req.params.user;
  var user = new User(req.app, slug ? {slug: slug} : {});
  user.findOne(function(err, result) {
    if (err || !result) {
      req.flash('error', 'The user you were trying to view (' + slug + ') ' +
          'was removed, or does not exist.');
      res.redirect(Users.INDEX_VIEW_);
    } else {
      // TODO: Strip Tags from the description.
      res.render(Users.SHOW_VIEW_, {
        title: result.user.title,
        description: result.user.description,
        result: result
      });
    }
  });
};
