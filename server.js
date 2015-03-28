"use strict";
require("babel/register");

module.exports = function (options, finallyCallback) {
  var Configuration = require("./server-only/lib/Configuration");
  var Helpers = require("./server-only/lib/Helpers");
  var path = require("path");

  var PROJECT_ROOT = path.join(__dirname, options.project);

  var express = require("express");
  var http = require("http");
  var debug = require("debug")(options.project);
  var async = require("async");

  var tasks = [];

  Configuration.load(path.join(__dirname, "/config"), options.project, {}, function (cerr, config) {
    if (cerr) {
      console.error("Error loading config", cerr);
      return;
    }

    var app = express();
    app.config = config;

    app.server = http.createServer(app);

    var React = require("react");
    var Router = require("react-router");

    var routes = require(PROJECT_ROOT + "/components/Routes");
    var alt = require(path.join(__dirname, "shared", "alt.js"));
    var Iso = require("iso");

    app.set("view engine", "html");
    app.set("views", path.join(PROJECT_ROOT, "templates"));
    app.engine("html", require("ejs").renderFile);

    tasks.push(function connectDatabase(cb) {
      // Would connect to database
      cb();
    });

    tasks.push(function populateDb(cb) {
      // if (config.env === "development") {
      //   // Would populate development data to DB
      // }
      cb();
    });

    tasks.push(function setupStaticRoutes(cb) {
      var staticDir = path.join(__dirname, "build", options.project);
      if (app.config.env === "production") {
        staticDir = path.join(__dirname, "deploy", options.project);
      }

      app.use("/public", express.static(staticDir));

      var favicon = require("serve-favicon");
      app.use(favicon(path.join(__dirname, "/assets/images/favicon.ico")));

      cb();
    });

    tasks.push(function configureMiddleware(cb) {
      debug("configureMiddleware");
      var bodyParser = require("body-parser");
      var cookieParser = require("cookie-parser");
      var csrf = require("csurf");

      app.use(cookieParser());
      app.use(bodyParser.json());

      if (config.env !== "test") {
        app.use(csrf({
          cookie: true
        }));
      } else {
        app.use(function (req, res, next) {
          req.csrfToken = function () {
            return "";
          };
          next();
        });
      }

      app.use(function errorHandler(err, req, res, next) {
        var code = 500;
        if (err.statusCode) {
          code = err.statusCode;
        }
        var msg = "Unexpected error has occurred!";
        if (err.message) {
          msg = err.message;
        }
        res.status(code).send(msg);
      });

      app.use(function prepareResData(req, res, next) {
        if (!res.locals.data) {
          res.locals.data = {};
        }
        next();
      });

      cb();
    });

    tasks.push(function setupRoutes(cb) {
      var routerFiles = Helpers.walkDirSync(path.join(__dirname, "/server-only/routes"), {
        ext: [".js"]
      });
      var projectRoutesPath = path.join(__dirname, "server-only", options.project, "routes");
      if (require("fs").existsSync(projectRoutesPath)) {
        var projectRouterFiles = Helpers.walkDirSync(projectRoutesPath, {
          ext: [".js"]
        });
        routerFiles = routerFiles.concat(projectRouterFiles);
      }
      routerFiles.forEach(function (rf) {
        var router;
        try {
          router = require(rf);
        } catch(err) {
          console.error("Unable to load router " + rf + ": " + err.message);
          console.error(err.stack);
          return;
        }
        try {
          router.registerRoutes(app);
        } catch (err) {
          console.error("Unable to register routes from router " + rf + ": " + err.message);
          console.error(err.stack);
          return;
        }
      });

      app.get("*", function populateCommonData(req, res, next) {
        debug("populateCommonData");
        if (!res.locals.data) {
          res.locals.data = {};
        }

        if (!res.locals.data.AuthStore) {
          res.locals.data.AuthStore = {};
        }
        res.locals.data.AuthStore.loggedIn = !!(app.dummyLoggedUser);

        next();
      });

      app.use(function mainRoute(req, res) {
        debug("mainRoute");
        if (!res.locals.data.ApplicationStore) {
          res.locals.data.ApplicationStore = {};
        }
        res.locals.data.ApplicationStore.csfr = req.csrfToken();
        debug("res.locals.data", res.locals.data);

        alt.bootstrap(JSON.stringify(res.locals.data || {}));

        var iso = new Iso();

        Router.run(routes, req.url, function (Handler) {
          var content = React.renderToString(React.createElement(Handler));
          iso.add(content, alt.flush());

          var html = iso.render();
          res.render("layout", {
            html: html,
            env: app.config.env
          });
        });
      });

      cb();
    });

    async.series(tasks, function(err) {
      if (err) {
        console.error("Error bringing up the server", err);
        return finallyCallback(err);
      }
      debug("All tasks done!");
      var port = (process.env.PORT || options.defaultPort || 8080);

      if (app.config.env !== "test") {
        app.server.listen(port, function() {
          console.log("Server listening on port " + port);
        });
      }

      finallyCallback(null, app);
    });
  });
};
