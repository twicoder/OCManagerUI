'use strict';
/**
 * Controller of the operation
 */
angular.module('basic')
  .controller('ServiceCtrl', ['$rootScope', '$scope', 'service', 'service_Confirm', 'service_change_Confirm', 'service_del_Confirm',
    function ($rootScope, $scope, service, service_Confirm, service_change_Confirm, service_del_Confirm) {
      let refresh = function (page) {
        $(document.body).animate({
          scrollTop: 0
        }, 200);
        let skip = (page - 1) * $scope.grid.size;
        $scope.items = $scope.serves.slice(skip, skip + $scope.grid.size);
      };

      function loaduser() {
        service.query(function (data) {
          $scope.serves = data;
          $scope.grid.total = data.length;
          refresh(1);
        });
      }

      loaduser();
      $scope.grid = {
        st: null,
        et: null,
        auto: null,
        page: 1,
        size: 20,
      };
      $scope.$watch('grid.page', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          refresh(newVal);
        }
      });
      $scope.addservice = function () {
        service_Confirm.open().then(function () {
          loaduser();
        });
      };
      $scope.changeservice = function () {
        service_change_Confirm.open();
      };
      $scope.delservice = function (name, id) {
        service_del_Confirm.open(name, id).then(function () {
          loaduser();
        });
      };
    }]);
