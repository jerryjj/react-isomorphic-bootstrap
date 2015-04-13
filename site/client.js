/*eslint-env es6, browser */
/*global window, __DEBUG__, NODE_ENV */
"use strict";

let debug = require("../shared/Debugger")("site");
if (__DEBUG__) {
  debug.enable("*,-engine.io-client:polling*,-engine.io-client:*");
}

// This is disabled until the package supports the latest React.
// if (NODE_ENV !== "production") {
//   // If you cannot find where the accessibility warning is coming from,
//   // set this to true and follow the stack trace in browser console.
//   let debugAccessibility = false;
//   require("react-a11y")({
//     throw: debugAccessibility
//   });
// }

// Example how to load external JS assets
//require("../assets/js/zepto.js");

import React from "react";
import Router from "react-router";
import Iso from "Iso";
import alt from "../shared/alt";
import routes from "./components/Routes";

let {HistoryLocation} = Router;

window.React = React; // For chrome dev tool support

// Once we bootstrap the stores, we run react-router using
// Router.HistoryLocation
// the element is created and we just render it into the container
// and our application is now live
Iso.bootstrap(function (state, _, container) {
  debug("Bootsrap Application with state", state);
  alt.bootstrap(state);

  Router.run(routes, HistoryLocation, function (Handler) {
    var node = React.createElement(Handler);
    React.render(node, container);
  });
});
