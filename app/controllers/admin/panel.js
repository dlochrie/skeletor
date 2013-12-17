exports.index = function(req, res) {
  /**
   * TODO: Shouldn't a block like this be in a `before` method?
   */
  var user = res.locals.user || null;
  if (!user) {
    req.flash('error', 'You should be logged in...');
    return res.redirect('/');
  }

  // TODO: This could change, and is here for the purpose of stubbing this
  // page out. It should be configured elsewhere.
  var sections = [{
    name: 'Posts',
    actions: [
      {title: 'List', path: '/admin/posts/'},
      {title: 'Create', path: '/admin/posts/new'}
    ]
  }, {
    name: 'Users',
    actions: [
      {title: 'List', path: '/admin/users'}
    ]
  }, {
    name: 'Comments',
    actions: [
      {title: 'List', path: '/admin/comments'}
    ]
  }];
  
  res.render('admin/index', {
    title: 'Admin Panel',
    sections: sections
  });
};
