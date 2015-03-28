"use strict";

exports.registerRoutes = (app) => {
  app.get("/about", function(req, res, next) {
    next();
  });
};
