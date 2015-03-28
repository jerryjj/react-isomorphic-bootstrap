"use strict";

let debug = require("debug")("routes:auth");

exports.registerRoutes = (app) => {
  app.post("/login", function (req, res, next) {
    debug("login", req.body);

    res.type("application/json");

    if (req.body.username === "dummy" && req.body.password === "password") {
      app.dummyLoggedUser = {
        id: "123",
        displayName: "Dummy User"
      };
      res.send({
        status: "ok",
        user: app.dummyLoggedUser
      });
      return;
    }

    res.status(403).send({
      status: "failed",
      error: "Invalid credentials"
    });
  });

  app.post("/profile", function (req, res, next) {
    res.send({
      status: "ok",
      user: app.dummyLoggedUser
    });
  });

  app.get("/profile", function (req, res, next) {
    if (app.dummyLoggedUser) {
      res.locals.data.AuthStore = {user: app.dummyLoggedUser};
      next();
    } else {
      res.redirect("/");
    }
  });

  app.get("/logout", function (req, res) {
    app.dummyLoggedUser = null;
    res.type("application/json");
    res.send({status: "ok"});
  });

};
