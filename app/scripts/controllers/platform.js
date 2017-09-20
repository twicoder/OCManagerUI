/**
 * Created by sorcerer on 2017/6/12.
 */
'use strict';

/**
 * Controller of the operation
 */
angular.module('basic')
  .controller('PlatformCtrl', ['$rootScope', '$scope', 'role', 'user', 'homesso', '$state',
    function ($rootScope, $scope, role, user, homesso, $state) {
      //$rootScope.tab = "service";
      role.query(function (data) {
        console.log('data', data);
      }, function (err) {
        console.log('err', err);
      });
      $scope.toconsole = function () {
        user.query(function (data) {
          $rootScope.users=data;
          //ui-sref="console.tenant"
          var ishas = false;
          angular.forEach(data, function (use) {

            if (homesso['http_x_proxy_cas_loginname'] === use.username) {
              ishas = true;

            }
          });
          if (ishas) {
            $state.go('console.tenant');
          }else {
            $state.go('home.permission');

          }
        });

      };

      //图片预加载
      var images = new Array();

      function preload() {
        for (var i = 0; i < arguments.length; i++) {
          images[i] = new Image();
          images[i].src = arguments[i];
        }
      }
      preload(
        "images/home_tenant.png",
        "images/home_orange.png",
        "images/home_genplum.png",
        "images/home_mongo.png"
      );

    }]);
