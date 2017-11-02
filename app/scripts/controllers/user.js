'use strict';
/**
 * Main Controller
 */
angular.module('basic')
  .controller('UserCtrl', ['$timeout', '$state', 'authctype', 'updatepwd', '$rootScope', '$scope', 'user', 'user_Confirm', 'user_change_Confirm', 'user_del_Confirm', 'newUser',
    function ($timeout, $state, authctype, updatepwd, $rootScope, $scope, user, user_Confirm, user_change_Confirm, user_del_Confirm, newUser) {
      let refresh = function (page) {
        $(document.body).animate({
          scrollTop: 0
        }, 200);
        $scope.isshow = false;
        let skip = (page - 1) * $scope.grid.size;
        $scope.items = $scope.users.slice(skip, skip + $scope.grid.size);
        let a = $timeout(function () {
          return 'angular';
        }, 500);
        a.then(function () {
          $scope.isshow = true;
          $timeout.cancel(a);
        });
      };
      authctype.get({}, function (type) {
        $scope.userladp = !type.type;
      });
      $scope.$watch('grid.txt', function (n, o) {
        if (n === o) {
          return;
        }
        if (!n) {
          $scope.users = angular.copy($scope.copyusers);
          refresh(1);
          $scope.grid.page = 1;
          $scope.grid.total = $scope.copyusers.length;
        } else {
          let iarr = [];
          let str = $scope.grid.txt;
          str = str.toLocaleLowerCase();
          angular.forEach($scope.copyusers, function (item) {
            let nstr = item.username;
            nstr = nstr.toLocaleLowerCase();
            if (nstr.indexOf(str) !== -1) {
              iarr.push(item);
            }
          });
          $scope.users = angular.copy(iarr);
          refresh(1);
          $scope.grid.page = 1;
          $scope.grid.total = $scope.users.length;
        }
      });

      function loaduser() {
        newUser.query(function (data) {
          $scope.users = data;
          $scope.copyusers = angular.copy(data);
          $scope.grid.total = data.length;
          $scope.grid.page = 1;
          refresh(1);
        });
      }

      loaduser();
      $scope.grid = {
        st: null,
        et: null,
        auto: null,
        page: 1,
        txt: '',
        size: 24,
      };
      $scope.$watch('grid.page', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          refresh(newVal);
        }
      });
      $scope.adduser = function () {
        user_Confirm.open('', $scope.users).then(function () {
          loaduser();
          $state.reload();
        });
      };
      $scope.changeuser = function (item) {
        user_Confirm.open(item, '').then(function () {
          loaduser();
        });
      };
      $scope.deluser = function (name, id) {
        user_del_Confirm.open(name, id).then(function () {
          loaduser();
        });
      };
      $scope.updatepwd = function (name) {
        updatepwd.open(name);
      };
    }]);
