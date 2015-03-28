"use strict";

import alt from "../alt";

class ApplicationStore {
  constructor() {
    this.csfr = null;
  }
}

module.exports = alt.createStore(ApplicationStore);
