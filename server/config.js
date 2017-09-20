"use strict";
console.log('process.env.HUANJING', process.env.RELEASE_EDITION);
module.exports = {
  dev: {
    dist: 'app',
    port: 9000
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: process.env.RELEASE_EDITION
};
