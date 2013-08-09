exports.index = function(req, res) {

  // TODO: This could change, and is here for the purpose of stubbing this
  // page out. It should be configured elsewhere.
  var sections = [{
    name: 'Posts',
    actions: [
      {title: 'List', path:'admin/posts/'},
      {title: 'Create', path:'new'}
    ]
  }, { 
    name: 'Users',
    actions: [
      {title: 'List', path:'index'},
      {title: 'Create', path:'new'}
    ]
  }, { 
    name: 'Comments',
    actions: [
      {title: 'List', path:'index'},
      {title: 'Create', path:'new'}
    ]
  }, { 
    name: 'Photos',
    actions: [
      {title: 'List', path:'index'},
      {title: 'Create', path:'new'}
    ]
  }];
  res.render('admin/index', {title: 'Admin Panel', sections: sections});
};