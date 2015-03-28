"use strict";

exports.ForbiddenError = class ForbiddenError extends Error {
  constructor(message) {
    this.statusCode = 403;
    this.message = message;
    super(message);
  }
};
