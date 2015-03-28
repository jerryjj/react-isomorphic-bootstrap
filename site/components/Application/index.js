"use strict";

import React from "react";
let {RouteHandler} = require("react-router");

import Header from "../Header";
import Footer from "../Footer";

import AuthActions from "../../../shared/actions/AuthActions";
import AuthStore from "../../../shared/stores/AuthStore";

var Application = React.createClass({
  getInitialState: function() {
    return {
      currentUser: AuthStore.getState().user,
      userLoggedIn: AuthStore.getState().loggedIn
    };
  },
  componentDidMount: function() {
    AuthStore.listen(this._onChange);
  },
  componentWillUnmount: function() {
    AuthStore.unlisten(this._onChange);
  },
  /**
  * Event handler for 'change' events coming from the AuthStore
  */
  _onChange: function() {
    this.setState({
      currentUser: AuthStore.getState().user,
      userLoggedIn: AuthStore.getState().loggedIn
    });
  },
  render: function () {
    if (this.state.userLoggedIn && !this.state.currentUser) {
      AuthActions.fetchUser();
    }

    return (
      <div className="o-application">
        <Header currentUser={this.state.currentUser} />
        <RouteHandler />
        <Footer />
      </div>
    );
  }
});

module.exports = Application;
