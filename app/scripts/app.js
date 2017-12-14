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
    "keys" : ['cuzBsiName', 'REQUEST_SIZE', 'REQUEST_NUMBER'],
    "cuzBsiName": {
      "name": "Namespace名称"
    },
    "planName": "实例类型",
    "REQUEST_SIZE": {
      "name": "REQUEST_SIZE",
      "type": "inputGroup",
      "unit": "DAYS",
      "typeInputs": [
        "DAYS"," HOURS", "MINUTES", "SECONDS","MILLISECONDS","MICROSECONDS","NANOSECONDS"
      ]
    },
    "REQUEST_NUMBER": {
      "name": "REQUEST_NUMBER",
      "type": "inputGroup",
      "unit": "DAYS",
      "typeInputs": [
        "DAYS"," HOURS", "MINUTES", "SECONDS","MILLISECONDS","MICROSECONDS","NANOSECONDS"
      ]
    }
  },
  "redis": {
    "name": "实例名称",
    "planName": "实例类型"
  },
  "storm": {
    "name": "实例名称",
    "planName": "实例类型"
  },
  "ocsp": {
    "name": "实例名称",
    "planName": "实例类型",
    "keys" : ['ATTR_mysql_host', 'ATTR_mysql_port', 'ATTR_mysql_database', 'ATTR_mysql_user', 'ATTR_mysql_pass', 'ATTR_ocsp_user', 'ATTR_codis_addr'],
    "ATTR_mysql_host": {
      "name": "mysql_host"
    },
    "ATTR_mysql_port": {
      "name": "mysql_port"
    },
    "ATTR_mysql_database": {
      "name": "mysql_database"
    },
    "ATTR_mysql_user": {
      "name": "mysql_user"
    },
    "ATTR_mysql_pass": {
      "name": "mysql_pass"
    },
    "ATTR_ocsp_user": {
      "name": "ocsp_user"
    },
    "ATTR_codis_addr": {
      "name": "codis_addr"
    }
  },
  "default": {
    "name": "实例名称",
    "keys" : ['cuzBsiName'],
    "cuzBsiName": {
      "name": "实例路径"
    },
    "planName": "实例类型"
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
