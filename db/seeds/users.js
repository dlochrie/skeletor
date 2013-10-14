var table = 'user';
module.exports = 'INSERT INTO ' + table + ' (' +
  'displayName, slug, email, google_id, facebook_id, created, updated) ' +
  'VALUES ' +
  '("testing test", "testing-test", "tt@email.com", "g123", "f123", ' +
  'NOW(), NOW())';