/*eslint-env es6 */
"use strict";

import React from "react";
import Router from "react-router";
let {Route, DefaultRoute} = Router;

import Application from "./Application";
import About from "./About";
import Home from "./Home";
import UserProfile from "./UserProfile";

let routes = (
  <Route name="app" path="/" handler={Application}>
    <Route name="about" handler={About}/>
    <Route name="profile" path="/profile" handler={UserProfile}/>
    <DefaultRoute name="home" handler={Home}/>
  </Route>
);

module.exports = routes;
