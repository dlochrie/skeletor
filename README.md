skeletor-new
============

New version of skeletor.

## DB

Example config:

    mysql> CREATE DATABASE skeletor;
    mysql> GRANT ALL PRIVILEGES ON skeletor.* TO "skeletor"@"localhost" IDENTIFIED BY "skelepass";
    mysql> FLUSH PRIVILEGES;
    mysql> EXIT

## Test

### Installed Application

    npm test


## Troubleshooting

If you get `Error: req.flash() requires sessions`, it most likely means that
the server cannot connect to `redis`.



