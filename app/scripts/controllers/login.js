/**
 * Created by sorcerer on 2017/8/3.
 */
angular.module('basic')
  .controller('loginCtrl',['login','$scope','Cookie','$state',function (login,$scope,Cookie,$state) {
    //$rootScope.tab = "service";
    $scope.usermessage={
      username:'',
      password:''
    }
    $scope.gologin= function () {
      login.post($scope.usermessage, function (data) {
        //console.log('data', data);
        Cookie.set('token', data.token, 24 * 3600 * 1000);
        $state.go('console.tenant');
      })
    }
  }]);
