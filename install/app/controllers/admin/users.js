var Util = require('../util');
var User = require('../../models/user');


/**
 * Expose `AdminUsers` Controller.
 */
module.exports = new AdminUsers;



/**
 * AdminUsers Controller.
 * @constructor
 */
function AdminUsers() {}


/**
 * Path to users index page.
 * @const
 * @private {string}
 */
AdminUsers.INDEX_VIEW_ = 'admin/users/';


/**
 * Path to users create view.
 * @const
 * @private {string}
 */
AdminUsers.CREATE_VIEW_ = 'admin/users/new';


/**
 * Path to users edit view.
 * @const
 * @private {string}
 */
AdminUsers.UPDATE_VIEW_ = 'admin/users/edit';


/**
 * Path to users delete view.
 * @const
 * @private {string}
 */
AdminUsers.DELETE_VIEW_ = 'admin/users/delete';


/**
 * Renders users' admin index page. Lists all users.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.index = function(req, res) {
  var user = new User(req.app, req.body);
  user.find(function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the users: ' + err);
      res.redirect('/admin');
    } else {
      res.render(AdminUsers.INDEX_VIEW_, {
        title: 'Users Administration',
        results: results
      });
    }
  });
};


/**
 * Shows the Users' edit form.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.edit = function(req, res) {
  var user = new User(req.app, {id: parseInt(req.params.user)});
  user.findOne(function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error editing the user: ' + err);
      res.redirect(AdminUsers.INDEX_VIEW_);
    } else {
      res.render('admin/users/edit', {
        title: 'Edit User', result: result, token: res.locals.token
      });
    }
  });
};


/**
 * Updates the user.
 * Note: The Slug SHOULD NOT be modified here so that bookmarks are persisted.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.update = function(req, res) {
  var user = new User(req.app, req.body);
  var id = parseInt(req.params.user);
  user.update({id: id}, function(err) {
    if (err) {
      req.flash('error', 'There was an error editing the user: ' + err);
      res.redirect('/admin/users/' + id + '/edit');
    } else {
      req.flash('success', 'User Successfully Updated');
      res.redirect(AdminUsers.INDEX_VIEW_);
    }
  });
};


/**
 * Renders the delete form.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.delete = function(req, res) {
  var user = new User(req.app, {id: parseInt(req.params.user)});
  user.findOne(function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error deleting the user: ' + err);
      res.redirect(AdminUsers.INDEX_VIEW_);
    } else {
      res.render(AdminUsers.DELETE_VIEW_, {
        title: 'Delete User', result: result, token: res.locals.token
      });
    }
  });
};


/**
 * Attempts to delete the resource and displays success or failure.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.destroy = function(req, res) {
  var user = new User(req.app, {id: parseInt(req.params.user)});
  user.remove(function(err) {
    if (err) {
      req.flash('error', 'There was an error deleting the user: ' + err);
    } else {
      req.flash('info', 'User Successfully Deleted.');
    }
    res.redirect(AdminUsers.INDEX_VIEW_);
  });
};
