var dir = ('../app/controllers/')
  , main = require(dir + 'main')
  , posts = require(dir + 'posts')
  , users = require(dir + 'users')
  , adminPanel = require(dir + 'admin/panel')
  , adminPosts = require(dir + 'admin/posts');

module.exports = function(app) {
  app.get('/', main.index);
  app.get('/about', main.about);
  app.get('/contact', main.contact);

  app.resource('posts', posts);
  app.resource('users', users);

  // TODO: This namespace should be protected by ACL 
  app.resource('admin', adminPanel);
  app.resource('admin/posts', adminPosts);
}