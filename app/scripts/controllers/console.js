'use strict';

/**
 * Main Controller
 */
angular.module('basic')
  .controller('ConsoleCtrl',['$rootScope', '$scope','sso','Cookie',
    function ($rootScope, $scope,sso,Cookie) {
    //$rootScope.tab = "service";
    //console.log('homesso', colsso);
    //Cookie.set('username', colsso['http_x_proxy_cas_loginname'],  24 * 3600 * 1000);
    //$scope.loginname = colsso['http_x_proxy_cas_loginname'];
    //$rootScope.isadmin = colsso.admin;
    //sso.get(function (data) {
    //  if (data['http_x_proxy_cas_loginname']) {
    //    $scope.loginname=data['http_x_proxy_cas_loginname']
    //    $rootScope.isadmin = data.admin;
    //    console.log('ssodata', data);
    //  }
    //
    //
    //}, function (err) {
    //  console.log('ssodata', err);
    //})
  }]);
