"use strict";

import debug from "debug";
let ExecutionEnvironment = require("react/lib/ExecutionEnvironment");

let originalLog = debug.log;
if (ExecutionEnvironment.canUseDOM) {
  debug.log = function() {};
}

let Debugger = function (namespace) {
  let d = debug(namespace);
  d.enable = function(str) {
    debug.enable(str);
    debug.log = originalLog;
  };
  return d;
};

module.exports = Debugger;
