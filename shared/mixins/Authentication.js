"use strict";

import AuthStore from "../stores/AuthStore";
import Router from "react-router";

let debug = require("../Debugger")("AuthenticatedMixin");

let AuthenticatedMixin = {
  mixins: [Router.Navigation],
  statics: {
    willTransitionTo: function (transition) {
      debug("willTransitionTo");
      if (!AuthStore.getState().user) {
        // Here we would redirect to signin page and set the nextPath
        // var nextPath = transition.path;
        // debug("redirect to signin", nextPath);
        // transition.redirect("/signin", {}, {"nextPath": nextPath});
        transition.redirect("/");
      }
    }
  },
  componentDidMount() {
    AuthStore.listen(this._onAuthChange);
  },
  componentWillUnmount() {
    AuthStore.unlisten(this._onAuthChange);
  },
  _onAuthChange() {
    if (AuthStore.getState().loggedIn) {
      this.transitionTo("/");
    }
  }
};

module.exports = AuthenticatedMixin;
