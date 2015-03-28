"use strict";

import sinon from "sinon";

exports.beforeEach = function (done) {
  this.sinon = sinon.sandbox.create();
  done();
};
exports.afterEach = function (done) {
  this.sinon.restore();
  done();
};

beforeEach(exports.beforeEach);
afterEach(exports.afterEach);
