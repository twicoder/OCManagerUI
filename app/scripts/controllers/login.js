'use strict';
/**
 * Created by sorcerer on 2017/8/3.
 */
angular.module('basic')
  .controller('loginCtrl', ['$location', 'login', '$scope', 'Cookie', '$state',
    function ($location, login, $scope, Cookie, $state) {
      $scope.usermessage = {};
      if (Cookie.get('jizhu') === 'true') {
        $scope.me = true;
        $scope.usermessage.username = Cookie.get('username');
      } else {
        $scope.me = false;
      }
      $scope.mark = function (res) {
        $scope.me = res !== 1;
        Cookie.set('jizhu', 'true', 24 * 3600 * 1000 * 30);
      };
      $scope.loginerr = false;
      $scope.$watch('usermessage', function (n, o) {
        if (n !== o) {
          $scope.loginerr = false;
        }
      }, true);
      $scope.gologin = function () {
        login.post($scope.usermessage, function (data) {
          Cookie.set('username', $scope.usermessage.username, 24 * 3600 * 1000 * 30);
          Cookie.set('token', data.token, 24 * 3600 * 1000);
          $state.go('console.tenant');
        },function(){
          $scope.loginerr = true;
        });
      };
    }]);
