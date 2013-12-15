var table = 'comment';
module.exports = 'INSERT INTO ' + table + ' (' +
  'user_id, post_id, body, body_md, created, updated) ' +
  'VALUES ' +
  '(1, 1, "First Test Comment", "<p>First Test Comment</p>",' +
  'NOW(), NOW()),' +
  '(2, 2, "Second Test Comment", "<p>Second Test Comment</p>",' +
  'NOW(), NOW())';