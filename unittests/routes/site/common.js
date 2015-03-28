"use strict";

import should from "should";
import request from "supertest";
import server from "../../../server";

var app = null;

describe("Default routes", () => {
  before((done) => {
    server({project: "site"}, (err, inst) => {
      if (err) {
        return done(err);
      }
      app = inst;
      done();
    });
  });

  it("Should respond to / path", (done) => {
    request(app)
    .get("/")
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it("Should respond to /health path", (done) => {
    request(app)
    .get("/health")
    .expect(200, "OK")
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

});
