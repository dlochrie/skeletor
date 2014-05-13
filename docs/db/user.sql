# Drops and creates the "user" table.

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `displayName` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `google_id` VARCHAR(100),
  `facebook_id` VARCHAR(100),
  `twitter_id` VARCHAR(100),
  `created` DATETIME NOT NULL,
  `updated` DATETIME NOT NULL,
  PRIMARY KEY(`id`),
  UNIQUE(`displayName`),
  UNIQUE(`email`)
);
