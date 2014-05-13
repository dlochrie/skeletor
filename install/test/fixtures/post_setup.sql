INSERT INTO `post` (
    `user_id`, `title`, `slug`, `description`, `description_md`, `body`,
    `body_md`, `created`, `updated`
  )
VALUES (
    1, 'First Post', 'first-post', '<p>Description for First Post</p>',
    'Description for First Post', '<p>Body for First Post<p>',
    'Body for First Post.', NOW(), NOW()
  ), (
    1, 'Second Post', 'second-post', '<p>Description for Second Post</p>',
    'Description for Second Post', '<p>Body for Second Post<p>',
    'Body for Second Post.', NOW(), NOW()
  );
