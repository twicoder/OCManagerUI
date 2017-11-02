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
).config(['$httpProvider', 'GLOBAL', function ($httpProvider) {
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
