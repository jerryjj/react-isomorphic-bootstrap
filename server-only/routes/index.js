"use strict";

exports.registerRoutes = (app) => {
  app.get("/health", function(req, res) {
    res.send("OK");
  });
};
