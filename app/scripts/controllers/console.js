'use strict';

/**
 * Main Controller
 */
angular.module('basic')
  .controller('ConsoleCtrl', ['$rootScope', '$scope', 'sso', 'Cookie', '$state', 'createkeytab','getkeytab',
    function ($rootScope, $scope, sso, Cookie, $state, createkeytab,getkeytab) {
      //$rootScope.tab = "service";
      //console.log('homesso', colsso);
      //Cookie.set('username', colsso['http_x_proxy_cas_loginname'],  24 * 3600 * 1000);
      $scope.loginname = Cookie.get("username");
      //$rootScope.isadmin = colsso.admin;
      $scope.logout = function () {
        Cookie.clear('username');
        Cookie.clear('tenantId');
        Cookie.clear('token');
        $state.go('home.login');
      }
      //console.log('location.pathname', location);
      $scope.download = function () {
        createkeytab.post({krbusername: Cookie.get('username')}, function (data) {
          console.log('data', data);
          if (data) {
            if (location.pathname) {
              var path = location.pathname
            } else {
              var path = ''
            }
            //getkeytab.get({name:Cookie.get('username')}, function (getdata) {
            //  console.log('getdata', getdata);
            //})
            var durl = location.origin + path + 'ocmanager/v1/api/kerberos/keytab/' + Cookie.get('username');
            console.log('durl', durl);
            console.log('location', path);
            location.href = durl;
          }
        }, function (err) {

        })


      }
      // $('.navbar-right>li').mouseover(function(){
      //     $(this).css({"border-bottom-color":"#f39c12","border-bottom-width":"2px",'border-bottom-style':'solid'}).siblings('li').css('border','none')
      // });
      $scope.navArr = [
        {name: '租户管理', url: 'console.tenant', bdb: true},
        {name: '用户管理', url: 'console.user', bdb: false},
        {name: '角色管理', url: 'console.role', bdb: false},
        {name: '服务管理', url: 'console.service', bdb: false}
      ];
      $scope.idx = 0;
      $scope.changeUrl = function (url, idx) {
        $state.go(url);
        $scope.idx = idx;
      };
      $scope.addBdb = function (idx) {
        $scope.navArr[idx].bdb = true;
        if (idx != $scope.idx) {
          $scope.navArr[$scope.idx].bdb = false;
        }

      };
      $scope.removeBdb = function (idx) {
        $scope.navArr[idx].bdb = false;
        $scope.navArr[$scope.idx].bdb = true;
      };
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
