'use strict';

/**
 * Controller of the operation
 */
angular.module('basic')
  .controller('HomeCtrl', ['$rootScope', '$scope','sso','Cookie',
    function ($rootScope, $scope,sso,Cookie) {
    //$rootScope.tab = "service";
    //  console.log('homesso', homesso);
    //  Cookie.set('username', homesso['http_x_proxy_cas_loginname'],  24 * 3600 * 1000);
    //  $scope.loginname = homesso['http_x_proxy_cas_loginname'];
    //  $rootScope.isadmin = homesso.admin;
    //  sso.get(function (data) {
    //  if (data['http_x_proxy_cas_loginname']) {
    //    $scope.loginname = data['http_x_proxy_cas_loginname']
    //    console.log('ssodata', data);
    //    $rootScope.isadmin = data.admin;
    //  }
    //
    //
    //}, function (err) {
    //  console.log('ssodata', err);
    //})
  }]);
