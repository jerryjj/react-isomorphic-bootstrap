"use strict";

import React from "react/addons";
let ReactTestUtils = React.addons.TestUtils;

import Router from "react-router";
let {RouteHandler, Route} = Router;
let TestLocation = require("react-router/lib/locations/TestLocation");

import routes from "../../../../site/components/Routes";
import Header from "../../../../site/components/Header";

describe("Header", function () {

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

  it("should create a new instance of Header", function () {
    expect(component).toBeDefined();
  });

  it("shouldn't have currentUser in props", function () {
    var headerComp = ReactTestUtils.findRenderedComponentWithType(component, Header);
    expect(headerComp.props.currentUser).toBe(null);
  });
});
