"use strict";

var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function (grunt) {
  var uglify_files = {};
  uglify_files["./deploy/" + grunt.option("projectName") + "/js/client.min.js"] = [
    "./build/" + grunt.option("projectName") + "/js/client.js"
  ];
  uglify_files["./deploy/" + grunt.option("projectName") + "/js/vendor.min.js"] = [
    "./build/" + grunt.option("projectName") + "/js/vendor.bundle.js"
  ];

  var debug = true;
  if (process.env.NODE_ENV === "production") {
    debug = false;
  }

  grunt.initConfig({
    clean: ["./build/" + grunt.option("projectName")],
    concurrent: {
      dev: ["nodemon:dev", "webpack:dev", "copy:vstyles", "sass:dev", "watch:cssdev"],
      options: {
        logConcurrentOutput: true
      }
    },
    nodemon: {
      dev: {
        script: "./" + grunt.option("projectName") + "-server.js",
        options: {
          ignore: ["build/**", "node_modules/**", "unittests/**", "test/**"],
          ext: "js,jsx",
          watch: [
            "./" + grunt.option("projectName"),
            "./",
            "./config",
            "./server-only",
            "./shared"
          ],
          env: {
            "DEBUG": "*,-babel,-engine:polling"
          }
        }
      }
    },
    webpack: {
      options: {
        failOnError: false
      },
      dev: {
        resolve: {
          root: "./" + grunt.option("projectName"),
          extensions: ["", ".js", ".jsx"],
          modulesDirectories: ["node_modules"]
        },
        entry: {
          client: "./" + grunt.option("projectName") + "/client.js",
          vendor: ["react", "react-router", "superagent", "alt", "Iso"]
        },
        output: {
          path: "./build/" + grunt.option("projectName") + "/js",
          filename: "client.js"
        },
        module: {
          loaders: [
            {
              test: /\.css$/,
              loader: ExtractTextPlugin.extract("css-loader")
            },
            {
              test: /\.(otf|eot|svg|ttf|woff)/,
              loader: "url-loader?limit=8192"
            },
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ["babel-loader"] },
            { test: /\.(js)$/, exclude: /node_modules|assets/, loaders: ["eslint-loader"] }
          ]
        },
        stats: {
          colors: true
        },
        devtool: "source-map",
        watch: true,
        keepalive: true,
        plugins: [
          new webpack.DefinePlugin({
            "__DEBUG__": debug,
            "NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
          }),
          new webpack.PrefetchPlugin("react"),
          new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
          new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
        ]
      }
    },
    uglify: {
      publish: {
        options: {
          mangle: false,
          compress: {
            drop_console: true
          }
        },
        files: uglify_files
      }
    },
    karma: {
      unit: {
        configFile: "karma.conf.js"
      }
    },
    sass: {
      dev: {
        files: [
          {
            expand: true,
            cwd: "./assets/css/" + grunt.option("projectName"),
            src: ["*.scss"],
            dest: "./build/" + grunt.option("projectName") + "/css/",
            ext: ".css"
          },
          {
            expand: true,
            cwd: "./assets/css/vendor",
            src: ["*.scss", "*.css"],
            dest: "./build/" + grunt.option("projectName") + "/css/",
            ext: ".css"
          }
        ]
      },
      dist: {
        options: {
          sourcemap: "none"
        },
        files: [
          {
            expand: true,
            cwd: "./assets/css/" + grunt.option("projectName"),
            src: ["*.scss"],
            dest: "./deploy/" + grunt.option("projectName") + "/css/",
            ext: ".css"
          },
          {
            expand: true,
            cwd: "./assets/css/vendor",
            src: ["*.scss", "*.css"],
            dest: "./deploy/" + grunt.option("projectName") + "/css/",
            ext: ".css"
          }
        ]
      }
    },
    watch: {
      cssdev: {
        files: "./assets/css/" + grunt.option("projectName") + "/**/*.scss",
        tasks: ["sass:dev"]
      }
    },
    copy: {
      vstyles: {
        files: [
          {
            expand: true,
            cwd: "./assets/css/vendor/lib",
            src: ["*.*", "**/*.*"],
            dest: "./build/" + grunt.option("projectName") + "/css/lib",
          },
          {
            expand: true,
            cwd: "./assets/images",
            src: ["*.*", "**/*.*"],
            dest: "./build/" + grunt.option("projectName") + "/images",
          }
        ]
      }
    },
    eslint: {
      options: {
        quiet: false
      },
      target: [
        "./server-only",
        "./site",
        "./shared",
        "./server.js",
        "./site-server.js"
      ]
    }
  });

  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-eslint");

  grunt.registerTask("default", ["clean", "concurrent:dev"]);
  grunt.registerTask("lint", ["eslint"]);
  grunt.registerTask("embedded", ["clean", "concurrent:embedded"]);
  grunt.registerTask("mobile", ["clean", "concurrent:mobile"]);
  grunt.registerTask("styles", ["copy:vstyles", "sass:dev", "watch:cssdev"]);
  grunt.registerTask("test", ["karma"]);
  grunt.registerTask("publish", ["sass:dist", "uglify:publish"]);
};
