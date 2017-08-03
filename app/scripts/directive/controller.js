/**
 * Created by sorcerer on 2017/6/7.
 */
"use strict";
angular.module('basic.controller', [])
  .controller('AppCtrl', ['$rootScope', '$state', '$log', 'AUTH_EVENTS',
    function ($rootScope, $state, $log, AUTH_EVENTS) {
    //console相关全局变量
    $rootScope.console = {};

    $rootScope.$on(AUTH_EVENTS.loginNeeded, function () {
      $log.info(AUTH_EVENTS.loginNeeded);
      //Cookie.clear('namespace');
      //Cookie.clear('df_access_token');
      //Cookie.clear('region');
      //$rootScope.region = '';
      //$rootScope.user = '';
      //$rootScope.namespace = "";
      $state.go('home.login');
    });
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
      $log.info(AUTH_EVENTS.loginSuccess);
    });
    $rootScope.$on(AUTH_EVENTS.httpForbidden, function () {
      $log.info(AUTH_EVENTS.httpForbidden);
      //Cookie.clear('namespace');
      //Cookie.clear('df_access_token');
      //Cookie.clear('region');
      //$rootScope.region = '';
      //$rootScope.user = '';
      //$rootScope.namespace = "";
      $state.go('home.login');
    });
  }]);
