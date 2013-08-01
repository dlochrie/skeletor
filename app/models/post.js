var Model = require('./model');


// Expose `Post` Model
module.exports = Post;


/**
 * 
 */
function Post(app, resource) {

  console.log(app.locals.settings.db)

  this.app = app;
  this.modelName = 'post';
  this.structure = STRUCTURE;
  Model.call(this, resource);
}
require('util').inherits(Post, Model);


/**
 * Find all records for a model.
 * @param {Function} cb Callback function. 
 * @return function
 */
Post.prototype.all = function(cb) {
  var query = this.prepareQuery(STRUCTURE);
  this.query(query, cb);
};

Post.prototype.find = function(params, limit, cb) {
  var query = this.prepareQuery(STRUCTURE);
  this.query(query, params, limit, cb);
};

// Generates:
// SELECT 
//   post.id, 
//   post.title, 
//   post.description, 
//   post.body,
//   post.created,
//   post.updated,
//   user.id,
//   user.displayName,
//   user.email
// FROM
//   post
// JOIN
//   user
// ON
//   post.user_id = user.id

// Missing WHERE and LIMIT
var STRUCTURE = {
  "columns": {
    "post": [
      "id", 
      "title", 
      "description", 
      "body",
      "created",
      "updated"    
    ],
    "user": [
      "id",
      "displayName",
      "email"
    ]
  },
  "primary": "post",
  "joins": [{
    "relation": "user",
    "relation key": "id",
    "foreign key": "user_id"
  }]
};


// Validations should go here...