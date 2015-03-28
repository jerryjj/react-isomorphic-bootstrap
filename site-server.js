"use strict";

require("./server")({
  project: "site",
  defaultPort: 8080
}, function (err, server) {
  if (err) {
    throw err;
  }
});
