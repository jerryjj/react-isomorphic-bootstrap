"use strict";

import alt from "../alt";
import request from "superagent";
import ReactUpdates from "react/lib/ReactUpdates";

import AuthActions from "../actions/AuthActions";
import ApplicationStore from "./ApplicationStore";

let debug = require("../Debugger")("AuthStore");

function batchedCallback(callback) {
  return function(err, res) {
    ReactUpdates.batchedUpdates(callback.bind(null, err, res));
  };
}

class AuthStore {
  constructor() {
    this.bindListeners({
      updateUser: AuthActions.updateUser,
      fetchUser: AuthActions.fetchUser,
      doLogin: AuthActions.doLogin,
      doLogout: AuthActions.doLogout,
      loginSuccess: AuthActions.loginSuccess,
      loginError: AuthActions.loginError,
      logoutSuccess: AuthActions.logoutSuccess
    });

    this.user = null;
    this.loggedIn = false;
    this.loginError = null;
  }
  updateUser(user) {
    debug("updateUser", user);
    this.user = user;
  }
  fetchUser(data = {}) {
    this.waitFor(ApplicationStore.dispatchToken);
    data._csrf = ApplicationStore.getState().csfr;

    debug("fetchUser", data);

    request.post("/profile")
    .set("Accept", "application/json")
    .type("json")
    .send(data)
    .end(batchedCallback(function(err, res) {
      if (err) {
        console.log("Handle fetch error", err);
        return;
      }
      if (res.status !== 200) {
        console.log("Request failed with " + res.status + ": " + res.text);
        return;
      }

      if (res.body && res.body.user) {
        AuthActions.updateUser(res.body.user);
      }
    }));
  }
  doLogin(data) {
    this.waitFor(ApplicationStore.dispatchToken);
    data._csrf = ApplicationStore.getState().csfr;

    let nextPath = null;
    if (data.nextPath) {
      nextPath = data.nextPath;
      delete data.nextPath;
    }

    debug("doLogin", data);

    request.post("/login")
    .set("Accept", "application/json")
    .type("json")
    .send(data)
    .end(batchedCallback(function(err, res) {
      if (err) {
        console.log("Handle login error", err);
        AuthActions.loginError({error: err, nextPath: nextPath});
        return;
      }
      if (res.status !== 200) {
        console.log("Request failed with " + res.status + ": " + res.text);
        AuthActions.loginError({error: new Error(res.text), nextPath: nextPath});
        return;
      }

      if (res.body && res.body.user) {
        AuthActions.loginSuccess({nextPath: nextPath});
        AuthActions.updateUser(res.body.user);
      } else {
        let err = new Error("Invalid response");
        AuthActions.loginError({error: err, nextPath: nextPath});
      }
    }));
  }
  doLogout() {
    debug("doLogout");

    request.get("/logout")
    .set("Accept", "application/json")
    .type("json")
    .end(batchedCallback(function(err, res) {
      if (err) {
        console.log("Handle logout error", err);
        return;
      }
      if (res && res.error) {
        console.log("Handle logout error", res.error);
        return;
      }
      AuthActions.logoutSuccess();
    }));
  }
  loginSuccess() {
    this.loggedIn = true;
    this.loginError = null;
  }
  loginError(data) {
    this.loggedIn = false;
    this.loginError = data;
  }
  logoutSuccess() {
    this.user = null;
    this.loggedIn = false;
    this.loginError = null;
  }
}

module.exports = alt.createStore(AuthStore);
