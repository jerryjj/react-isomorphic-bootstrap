"use strict";

import React from "react";
import AuthenticatedMixin from "../../../shared/mixins/Authentication";
import AuthActions from "../../../shared/actions/AuthActions";

let UserProfile = React.createClass({
  mixins: [AuthenticatedMixin],
  dummyLogout() {
    AuthActions.doLogout();
  },
  render: function () {
    return (
      <div className="container">
        <h1>User Profile</h1>
        <p>Protected page</p>
        <p>
          <a onClick={this.dummyLogout}>Logout</a>
        </p>
      </div>
    );
  }
});

module.exports = UserProfile;
