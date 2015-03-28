"use strict";

import alt from "../alt";

class AuthActions {
  constructor() {
    this.generateActions(
      "updateUser",
      "fetchUser",
      "doLogin",
      "doLogout",
      "loginSuccess",
      "loginError",
      "logoutSuccess",
      "toggleProfilePane" // Triggered to toggle the right profile pane
    );
  }
}

module.exports = alt.createActions(AuthActions);
