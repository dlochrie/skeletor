module.exports = function(app) {
  var express = require('express'),
      env = process.env.NODE_ENV || 'development';

  /**
   * Development and Prod, but NOT Test
   */
  app.configure('development', 'production', function() {
    /**
     * Setup Anti-Forgery
     * usage: (Where `token` is available as a local var)
     *   input(name="csrf-token",type="hidden,content=token)
     */
    app.use(express.csrf());
    app.use(function(req, res, next) {
      res.locals.token = req.session._csrf;
      next();
    });
  });

  /**
   * Development and Test Only
   */
  app.configure('development', 'test', function() {
    app.use(express.logger('dev'));
  });
};
