var dir = ('../app/controllers/')
  , main = require(dir + 'main')
  , posts = require(dir + 'posts')
  , users = require(dir + 'users')
  , adminPanel = require(dir + 'admin/panel');

module.exports = function(app) {
  app.get('/', main.index);
  app.get('/about', main.about);
  app.get('/contact', main.contact);

  app.resource('posts', posts);
  app.resource('users', users);

  app.resource('admin', adminPanel);
}