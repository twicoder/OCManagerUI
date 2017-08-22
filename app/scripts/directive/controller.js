/**
 * Created by sorcerer on 2017/6/7.
 */
"use strict";
angular.module('basic.controller', [])
  .controller('AppCtrl', ['$rootScope', '$state', '$log', 'AUTH_EVENTS','Cookie',
    function ($rootScope, $state, $log, AUTH_EVENTS,Cookie) {
    //console相关全局变量
    $rootScope.console = {};

    $rootScope.$on(AUTH_EVENTS.loginNeeded, function () {
      $log.info(AUTH_EVENTS.loginNeeded);
      //Cookie.clear('username');
      //Cookie.clear('tenantId');
      //Cookie.clear('token');
      ////$rootScope.region = '';
      ////$rootScope.user = '';
      ////$rootScope.namespace = "";
      //$state.go('home.login');
    });
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
      $log.info(AUTH_EVENTS.loginSuccess);
    });
    $rootScope.$on(AUTH_EVENTS.httpForbidden, function () {
      $log.info(AUTH_EVENTS.httpForbidden);
      Cookie.clear('username');
      Cookie.clear('tenantId');
      Cookie.clear('token');
      //$rootScope.region = '';
      //$rootScope.user = '';
      //$rootScope.namespace = "";
      $state.go('home.login');
    });
  }]);
