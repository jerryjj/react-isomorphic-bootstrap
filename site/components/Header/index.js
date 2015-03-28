"use strict";

import React from "react"
import styles from "./styles";

let { Link } = require("react-router");
let { StyleResolverMixin, BrowserStateMixin } = require("radium");
let AuthActions = require("../../../shared/actions/AuthActions");

let Header = React.createClass({
  mixins: [
      StyleResolverMixin, BrowserStateMixin
  ],

  dummyLogin() {
    AuthActions.doLogin({
      username: "dummy",
      password: "password"
    });
  },

  render() {
    let loginButtonStyle = styles.loginButton;
    let profileLinkStyle = styles.profileLink;

    let userStr = (
      <a className="btn btn-xs round"
        onClick={this.dummyLogin}
        {...this.getBrowserStateEvents()}
        style={this.buildStyles(loginButtonStyle)}>

        Login <span className="glyphicon glyphicon-log-in"></span>
      </a>
    );

    if (this.props.currentUser !== null) {
      userStr = (
        <Link to="/profile" className="btn btn-xs round">
          <span style={this.buildStyles(profileLinkStyle)}>
            <span className="glyphicon glyphicon-user"></span> {this.props.currentUser.displayName}
          </span>
        </Link>
      );
    }

    return (
      <nav className="navbar navbar-default navbar-static-top o-header">
        <div className="container">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">Project Logo</Link>
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
              {userStr}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Header;
