# Drops and creates the "post" table.

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT(10) UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  description_md TEXT NOT NULL,
  body TEXT NOT NULL,
  body_md TEXT NOT NULL,
  created DATETIME NOT NULL,
  updated DATETIME NOT NULL,
  PRIMARY KEY(id),
  UNIQUE(title),
  INDEX(user_id)
);
