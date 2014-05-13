/**
 * Expose `Posts` Controller.
 */
module.exports = new Admin;



/**
 * Admin Controller.
 * @constructor
 */
function Admin() {}


/**
 * Renders admin index page - this is pretty much a dashboard for admins.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Admin.prototype.index = function(req, res) {
  res.render('admin/index', {title: 'Admin Home'});
};
