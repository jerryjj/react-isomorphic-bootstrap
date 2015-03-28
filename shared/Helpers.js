"use strict";

let toObject = function toObject(val) {
  if (val == null) {
    throw new TypeError("Object.assign cannot be called with null or undefined");
  }
  return Object(val);
};

exports.merge = Object.assign || function mergeHelper(target) {
  let from, keys;
  let to = toObject(target);

  for (var s = 1; s < arguments.length; s++) {
    from = arguments[s];
    keys = Object.keys(Object(from));

    for (var i = 0; i < keys.length; i++) {
      to[keys[i]] = from[keys[i]];
    }
  }
  return to;
};
