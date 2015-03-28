"use strict";

import React from "react/addons";
let ReactTestUtils = React.addons.TestUtils;

import Router from "react-router";
let {RouteHandler, Route} = Router;
let TestLocation = require("react-router/lib/locations/TestLocation");

import routes from "../../../../site/components/Routes";
import Application from "../../../../site/components/Application";
import AuthActions from "../../../../shared/actions/AuthActions";

describe("Application", function () {

  let component, ApplicationElement;

  beforeEach(function (done) {
    var container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);

    var loc = new TestLocation([ "/" ]);

    Router.run(routes, loc, function (Handler) {
      ApplicationElement = React.createElement(Handler);
      component = React.render(ApplicationElement, container);
      done();
    });
  });

  it("should create a new instance of Application", function () {
    expect(component).toBeDefined();
  });

  it("shouldn't have currentUser in state", function () {
    var appComp = ReactTestUtils.findRenderedComponentWithType(component, Application);
    expect(appComp.state.currentUser).toBe(null);
  });

  it("should have currentUser in state after AuthAction.updateUser is triggered", function () {
    var appComp = ReactTestUtils.findRenderedComponentWithType(component, Application);
    expect(appComp.state.currentUser).toBe(null);
    AuthActions.updateUser({id: "test1", displayName: "Test User"});
    expect(appComp.state.currentUser.id).toBe("test1");
  });
});
