'use strict';

/**
 * Controller of the dataModel
 */
angular.module('basic')
  .controller('RoleCtrl', ['$scope', 'allRole', function ($scope, allRole) {
    allRole.query({}, function (res) {
      $scope.allRole = res;
    });
  }]);
