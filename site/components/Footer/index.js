"use strict";
import React from "react";
let {Link} = require("react-router");

let Footer = React.createClass({
  render: function() {
    return (
      <footer className="o-footer well well-sm">
        <div className="container">
          <div className="row">
            <h5 className="">Links</h5>
            <ul>
              <li><Link to="about" className="grey-text text-lighten-3">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            &copy; 2015 JerryJayJay
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = Footer;
