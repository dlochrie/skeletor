var dir = ('../app/controllers/')
  , main = require(dir + 'main')
  , posts = require(dir + 'posts')
  , users = require(dir + 'users');

module.exports = function(app) {
  app.get('/', main.index);
  app.get('/about', main.about);
  app.get('/contact', main.contact);

  app.resource('posts', require(dir + 'posts'));
  app.resource('users', require(dir + 'users'));
}