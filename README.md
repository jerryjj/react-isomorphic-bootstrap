# Isomorphic React project template

This is just tiny example project template, which provides one way of creating Isomorphic apps with React.
This also shows simple way how to separate the Authenticated user data from the server generate DOM so you can safely cache
the rendered to to frontend servers (varnish, etc.).

## Common actions

First install the commit hooks

    ./scripts/installDevGitHooks.sh

Then install all the dependencies

    npm install

## To run Tests with Karma

    npm run test-web

## To run Backend Unit tests with mocha

    npm run test-server

Project uses [Mocha](http://mochajs.org/) test framewowrk with [Should.js](https://github.com/tj/should.js) assertions.
Support for Mocks and Spying with [Sinon](http://sinonjs.org/).
If using Sinon you should require the "sinon-cleanup.js" script in your test file for Automatic cleanup support.

# Site

## Running in Development mode

    npm run site-dev

Goto localhost:8080

## Building deployable Javascripts (dependencies and logic separately)

    npm run site-publish

# Resources

https://github.com/facebook/react
https://github.com/goatslacker/alt
https://github.com/goatslacker/iso
