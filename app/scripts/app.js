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
      (function() {
        // Private array of chars to use
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

        Math.uuid = function (len, radix) {
          var chars = CHARS, uuid = [], i;
          radix = radix || chars.length;

          if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
          } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
              if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
              }
            }
          }

          return uuid.join('');
        };

        // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
        // by minimizing calls to random()
        Math.uuidFast = function() {
          var chars = CHARS, uuid = new Array(36), rnd=0, r;
          for (var i = 0; i < 36; i++) {
            if (i==8 || i==13 ||  i==18 || i==23) {
              uuid[i] = '-';
            } else if (i==14) {
              uuid[i] = '4';
            } else {
              if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
              r = rnd & 0xf;
              rnd = rnd >> 4;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
          return uuid.join('');
        };

        // A more compact, but less performant, RFC4122v4 solution:
        Math.uuidCompact = function() {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
          });
        };
      })();
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


