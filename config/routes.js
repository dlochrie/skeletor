var dir = ('../app/controllers/')
  , main = require(dir + 'main')
  , comments = require(dir + 'comments')
  , posts = require(dir + 'posts')
  , users = require(dir + 'users')
  , admin = require(dir + 'admin')
  , adminPanel = require(dir + 'admin/panel')
  , adminPosts = require(dir + 'admin/posts')
  , adminComments = require(dir + 'admin/comments')
  , adminUsers = require(dir + 'admin/users');

module.exports = function(app) {
  /**
   * Public Routes.
   */
  app.get('/', main.index);
  app.get('/about', main.about);
  app.get('/contact', main.contact);

  app.resource('comments', comments);
  app.get('/comments/:comment/flag', comments.flag);
  app.post('/comments/flag', comments.flag_confirm);

  app.resource('posts', posts);

  app.resource('users', users);
  app.get('/account', users.account);

  /**
   * TODO(dlochrie) This is a temporary admin check, but it needs to be
   * expanded on and refactored.
   *
   * Add authentication middleware to the `admin` namespace.
   */
  app.all('/admin/*', admin.authenticate);

  /**
   * Admin Routes. Should be protected by middleware above.
   */
  app.resource('admin', adminPanel);
  app.resource('admin/posts', adminPosts);
  app.get('/admin/posts/:post/delete', adminPosts.delete);
  app.resource('admin/users', adminUsers);
  app.get('/admin/users/:user/delete', adminUsers.delete);
  app.resource('admin/comments', adminComments);
}