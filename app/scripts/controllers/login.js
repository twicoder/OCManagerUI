/**
 * Created by sorcerer on 2017/8/3.
 */
angular.module('basic')
  .controller('loginCtrl',['$location','login','$scope','Cookie','$state',
    function ($location,login,$scope,Cookie,$state) {
    //$rootScope.tab = "service";
    $scope.usermessage={
      username:'',
      password:''
    }
      //console.log('location', location.origin);
      if (Cookie.get('jizhu')) {
      if (Cookie.get('jizhu') === 'true') {
        $scope.me = true;
        $scope.usermessage.username=Cookie.get('jzusername');
      }else if(Cookie.get('jizhu') === 'false'){
        $scope.me = false;
      }
    }else {
      $scope.me = false
    }
    $scope.mark= function (res) {
        if(res == 1){
          $scope.me = false
          Cookie.set('jizhu', 'false', 24 * 3600 * 1000*30);
        }else{
          $scope.me = true
          Cookie.set('jizhu', 'true', 24 * 3600 * 1000*30);
        }
    }
    $scope.loginerr=false;
    $scope.$watch('usermessage', function (n,o) {
      if (n === o) {
              return
      }
      //if (n) {
      console.log('n',n);
      $scope.loginerr=false;
              //}
    },true)
    $scope.gologin= function () {
      login.post($scope.usermessage, function (data) {
        //console.log('data', data);
        Cookie.set('username',$scope.usermessage.username ,  24 * 3600 * 1000);
        Cookie.set('jzusername',$scope.usermessage.username ,  24 * 3600 * 1000*30);
        Cookie.set('token', data.token, 24 * 3600 * 1000);
        $state.go('console.tenant');
      }, function (err) {
        console.log('err', err);
        $scope.loginerr=true;
      })
    }
  }]);
