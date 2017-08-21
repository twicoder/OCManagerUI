'use strict';

/**
 * Main Controller
 */
angular.module('basic')
  .controller('UserCtrl', ['authctype','updatepwd','$rootScope', '$scope', 'user', 'user_Confirm', 'user_change_Confirm', 'user_del_Confirm','newUser',
    function (authctype,updatepwd,$rootScope, $scope, user, user_Confirm, user_change_Confirm, user_del_Confirm,newUser) {
      var refresh = function (page) {
        $(document.body).animate({
          scrollTop: 0
        }, 200);
        var skip = (page - 1) * $scope.grid.size;
        $scope.items = $scope.users.slice(skip, skip + $scope.grid.size);
      };

      authctype.get({}, function (type) {
        //console.log('type', type);
        //type.type=1
        if (!type.type) {
          $scope.userladp=true;



        }else {
          $scope.userladp=false
        }

      })
      $scope.$watch('grid.txt', function (n, o) {
        if (n === o) {
          return
        }
        //$scope.items=[]
        if (!n) {
          $scope.users = angular.copy($scope.copyusers);
          refresh(1);
          $scope.grid.page = 1;
          $scope.grid.total = $scope.copyusers.length;
          //return;
        } else {
          var iarr = [];
          var str = $scope.grid.txt;
          str = str.toLocaleLowerCase();
          //console.log('$scope.copydata', $scope.copyusers);
          angular.forEach($scope.copyusers, function (item, i) {
            //console.log(item.build);
            var nstr = item.username;
            nstr = nstr.toLocaleLowerCase();
            if (nstr.indexOf(str) !== -1) {
              iarr.push(item)
            }
            //console.log(repo.instance_data, $scope.grid.txt);
          })


          $scope.users = angular.copy(iarr);
          refresh(1);
          //$scope.$apply()
          $scope.grid.page = 1;
          //console.log('$scope.data', $scope.users);
          $scope.grid.total = $scope.users.length;
        }
        //console.log('newVal', newVal);
      });

      function loaduser() {
        newUser.query(function (data) {
          console.log('data', data);
          $scope.users = data;
          $scope.copyusers=angular.copy(data);
          $scope.grid.total = data.length;
          $scope.grid.page = 1;

          refresh(1);
        }, function (err) {
          console.log('err', err);
        });
      }
      loaduser();


      $scope.grid = {
        st: null,
        et: null,
        auto: null,
        page: 1,
        txt:'',
        size: 24,
      };

      //$scope.usersearch = function () {
      //
      //  //if (!$scope.grid.txt) {
      //  //  $scope.users=[]
      //  //  $scope.users = angular.copy($scope.copyusers)
      //  //  refresh(1);
      //  //  $scope.grid.page = 1;
      //  //  $scope.grid.total = $scope.copyusers.length;
      //  //  //return;
      //  //} else {
      //  //  $scope.users=[]
      //  //  var iarr = [];
      //  //  var str = $scope.grid.txt;
      //  //  str = str.toLocaleLowerCase();
      //  //  //console.log('$scope.copydata', $scope.copyusers);
      //  //  angular.forEach($scope.copyusers, function (item, i) {
      //  //    //console.log(item.build);
      //  //    var nstr = item.username;
      //  //    nstr = nstr.toLocaleLowerCase();
      //  //    if (nstr.indexOf(str) !== -1) {
      //  //      iarr.push(item)
      //  //    }
      //  //    //console.log(repo.instance_data, $scope.grid.txt);
      //  //  })
      //  //
      //  //
      //  //  $scope.users = angular.copy(iarr);
      //  //  refresh(1);
      //  //  //$scope.$apply()
      //  //  $scope.grid.page = 1;
      //  //  console.log('$scope.data', $scope.users);
      //  //  $scope.grid.total = $scope.users.length;
      //  //}
      //
      //
      //}

      $scope.$watch('grid.page', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          refresh(newVal);
        }
      });

      //用户管理-添加
      $scope.adduser = function () {
        user_Confirm.open('', $scope.users).then(function () {
          loaduser();
        });
      };
//用户管理-修改
      $scope.changeuser = function (item) {
        user_Confirm.open(item, '').then(function () {
          loaduser();
        });
      };
//用户管理-删除
      $scope.deluser = function (name, id) {

        user_del_Confirm.open(name, id).then(function () {
          loaduser();

        });
      };
      $scope.updatepwd = function(){
        updatepwd.open();
      }

    }]);
