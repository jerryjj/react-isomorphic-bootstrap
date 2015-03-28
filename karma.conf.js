'use strict';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'test/helpers/**/*.js',
      'test/spec/**/components/**/*.js'
    ],
    preprocessors: {
      'test/spec/**/components/**/*.js': ['webpack']
    },
    webpack: {
      cache: true,
      module: {
        loaders: [
          { test: /\.css$/, loader: 'style!css' },
          { test: /\.scss$/, loader: 'css-loader!sass-loader' },
          { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
      },
      resolve: {
        extensions: ['', '.js', '.jsx']
      }
    },
    webpackServer: {
      stats: {
        colors: true
      }
    },
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    captureTimeout: 60000,
    singleRun: true
  });
};
