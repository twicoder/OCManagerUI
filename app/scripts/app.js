'use strict';

/**
 * @ngdoc overview
 * @name basicApp
 * @description
 * # basicApp
 *
 * Main module of the application.
 */
angular.module('basic', [
  'ngAnimate',
  'ngAria',
  'ngCookies',
  'ngMessages',
  'ngResource',
  'ui.router',
  'ngSanitize',
  'ngTouch',
  'pascalprecht.translate',
  'ngFileUpload',
  "isteven-multi-select",
  "dndLists",
  'ui.bootstrap',
  'ui-notification',
  'angularSpinner',
  'ngCookies',
  'ui.select',
  'toggle-switch',
  'cfp.hotkeys',
  'ui.bootstrap.datetimepicker',
  'angularMoment',
  'chart.js',
  'ui.router.state.events',
  'basic.router',
  'basic.resource',
  'basic.services',
  'basic.controller',
  'basic.filter',
  'treeControl',
  'highcharts-ng'
]).constant('GLOBAL', {
  size: 10,
  host: './ocmanager/v1/api',
  bdxhost: './sapi/v1',
  host_k8s: './api/v1',
  host_repos: './v1/repos',
  host_registry: './registry/api',
  host_lapi: './lapi',
  host_saas: './saas/v1',
  host_payment: './payment/v1',
  host_integration: './integration/v1',
  host_hawkular: './hawkular/metrics',
  host_wss: './ws/oapi/v1',
  host_repo: './repos',
  host_authorize: './authorize',
  host_wss_k8s: './ws/api/v1',
  login_uri: '/login',
  signin_uri: '/signin'
}).constant('AUTH_EVENTS', {
  loginNeeded: 'auth-login-needed',
  loginSuccess: 'auth-login-success',
  httpForbidden: 'auth-http-forbidden'
}).constant('_',
  window._
).constant('INSTANCES', {
  "hbase": {
    "name": "实例名称",
    "keys" : ['cuzBsiName', 'test'],
    "cuzBsiName": {
      "name": "HBase"
    },
    "test": {
      "name": "test"
    }
  },
  "hive": {
    "name": "实例名称",
    "keys" : ['MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_DATABASE', 'MYSQL_UNAME', 'MYSQL_PWD', 'OCSP_USER', 'CODIS_ADDR'],
    "MYSQL_HOST": {
      "name": "MYSQL_HOST"
    },
    "MYSQL_PORT": {
      "name": "MYSQL_PORT"
    },
    "MYSQL_DATABASE": {
      "name": "MYSQL_DATABASE"
    },
    "MYSQL_UNAME": {
      "name": "MYSQL_UNAME"
    },
    "MYSQL_PWD": {
      "name": "MYSQL_PWD"
    },
    "OCSP_USER": {
      "name": "OCSP_USER"
    },
    "CODIS_ADDR": {
      "name": "CODIS_ADDR"
    }
  },
  "default": {
    "name": "实例名称",
    "keys" : ['cuzBsiName'],
    "cuzBsiName": {
      "name": "实例路径"
    }
  }
}).config(['$httpProvider', 'GLOBAL', function ($httpProvider) {
  $httpProvider.interceptors.push(['$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
}]).run(['$rootScope', function ($rootScope) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    $rootScope.tab = toState.name;
  });
}]);
