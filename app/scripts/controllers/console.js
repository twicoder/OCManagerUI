'use strict';
/**
 * Main Controller
 */
angular.module('basic')
  .controller('ConsoleCtrl', ['$rootScope', '$scope', 'sso', 'Cookie', '$state', 'createkeytab',
    function ($rootScope, $scope, sso, Cookie, $state, createkeytab) {
      $scope.loginname = Cookie.get("username");
      $scope.logout = function () {
        if (Cookie.get('jizhu') === false) {
          Cookie.clear('username');
        }
        Cookie.clear('tenantId');
        Cookie.clear('token');
        $state.go('home.login');
      };
      $scope.download = function () {
        createkeytab.post({krbusername: Cookie.get('username')}, function (data) {
          if (data) {
            let path = location.pathname ? location.pathname : '';
            location.href = location.origin + path + 'ocmanager/v1/api/kerberos/keytab/' + Cookie.get('username');
          }
        });
      };
      $scope.naletr = [
        {name: '租户管理', url: 'console.tenant', bdb: true},
        {name: '用户管理', url: 'console.user', bdb: false},
        {name: '角色管理', url: 'console.role', bdb: false},
        {name: '服务管理', url: 'console.service', bdb: false}
      ];
      let getIdx = function () {
        for (let i = 0; i < $scope.naletr.length; i++) {
          if ($rootScope.tab === $scope.naletr[i].url) {
            return i;
          }
        }
      };
      $scope.idx = getIdx();
      $scope.changeUrl = function (url, idx) {
        $state.go(url);
        $scope.idx = idx;
      };
      $scope.addBdb = function (idx) {
        $scope.naletr[idx].bdb = true;
        if (idx !== $scope.idx) {
          $scope.naletr[$scope.idx].bdb = false;
        }
      };
      $scope.removeBdb = function (idx) {
        $scope.naletr[idx].bdb = false;
        $scope.naletr[$scope.idx].bdb = true;
      };
      $scope.removeBdb(0);
      $scope.addBdb($scope.idx);
    }]);
