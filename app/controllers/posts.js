var Post = require('../models/post');

exports.index = function(req, res) {
  var post = new Post(req.app, null);
  post.find(1, function(err, result) {
    if (err) res.send('There was an error getting results', err);
    if (result) {
      console.log('result', result)
      res.render('./posts/index', { title: 'Skeletor', posts: result})
    }
  });
}