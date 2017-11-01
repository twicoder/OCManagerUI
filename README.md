## OCManager

## Install

Node version: v6.9.1

Bower version: 1.8.0

Gulp version: CLI version 1.2.2

At first, run `yarn install` and `bower install` to install 3rd packages.

## Configuration

The default config file is in server/config.js. Change env to "prod" to run zipped js file.

```
"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 8900
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev"
};
```

## Start

Use `gulp serve` to start express server.

Use `gulp` to build static dist directory.

Use `gulp war` to generate war package.

## Env

localstart.sh script for setting envs.

## Test

Use `gulp test` to run karma+jasmine tests.
Use `gulp e2e` to run protractor tests.

