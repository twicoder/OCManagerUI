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
  'highcharts-ng',
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
  })
  .constant('AUTH_EVENTS', {
    loginNeeded: 'auth-login-needed',
    loginSuccess: 'auth-login-success',
    httpForbidden: 'auth-http-forbidden'
  })

  .config(['$httpProvider', 'GLOBAL', function ($httpProvider) {
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
  }])

  .run(['$rootScope', '$state', 'user', 'Cookie',
    function ($rootScope, $state, user, Cookie) {

      function statego(data) {
        var ishas = false;
        angular.forEach(data, function (use) {
          if (Cookie.get('username') === use.username) {
            ishas = true;
          }
        });
        if (!ishas) {
          $state.go('home.permission');
        }
      }

      $rootScope.$on('$stateChangeStart', function (event, toState) {
        console.log('toState', toState.name);

        $rootScope.tab = toState.name;
        //if (toState.name &&toState.name !== "home.permission") {
        //  if (!$rootScope.users) {
        //    user.query(function (data) {
        //      $rootScope.users = data;
        //      statego($rootScope.users);
        //    });
        //
        //  } else {
        //    statego($rootScope.users);
        //  }
        //}
        //console.log(Cookie.get('token'));
        //if (toState.name && toState.name !== "home.login") {
        //  if (Cookie.get('token')) {
        //    //user.query(function (data)
        //    // {
        //    //  $rootScope.users = data;
        //    //  statego($rootScope.users);
        //    //});
        //
        //  } else {
        //
        //    $state.go('home.login');
        //  }
        //}

        //console.log('$rootScope.tab', $rootScope.tab);
      });


      //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      //  //更新header标题
      //
      //});
    }]);


