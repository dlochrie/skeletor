var table = 'user';
module.exports = 'INSERT INTO ' + table + ' (' +
  'displayName, slug, email, google_id, facebook_id, created, updated) ' +
  'VALUES ' +
  '("joe tester", "joe-tester", "jt@email.com", "g123", "f123", ' +
  'NOW(), NOW()),' + 
  '("johnny edit", "johnny-edit", "je@email.com", "g123", "f123", ' +
  'NOW(), NOW())';