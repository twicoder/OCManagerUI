'use strict';

/**
 * Controller of the dataModel
 */
angular.module('basic')
  .controller('RoleCtrl',['$scope', 'allRole',function ($scope,allRole) {
    //$rootScope.tab = "role";

    //图片预加载
    //var images = new Array();
    //function preload() {
    //  for (var i = 0; i < arguments.length; i++) {
    //    images[i] = new Image();
    //    images[i].src = arguments[i];
    //  }
    //}
    //preload(
    //  "images/role_system.png",
    //  "images/role_company.png",
    //  "images/role_item.png",
    //  "images/role_team.png"
    //);
    allRole.query({}, function (res) {
      $scope.allRole = res;
    });
  }]);
