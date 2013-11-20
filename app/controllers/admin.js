/**
 * Quick and easy authorization for an administrator. Flashes a message and
 * redirects a user to the home page if they are not logged in.
 *
 * TODO: This SHOULD check for an ADMIN, not just an authenticated user.
 *
 * @param {!express.request} req Express request object.
 * @param {!express.response} res Express response object.
 * @param {function} next Express callback function.
 */
exports.authenticate = function(req, res, next) {
  var user = res.locals.user || null;
  if (user) return next();
  req.flash('error', 'This action is unauthorized.');
  res.redirect('/');
};