'use strict';
/**
 * Created by sorcerer on 2017/6/1.
 */

angular.module('basic.router', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/console/tenant");
    $stateProvider
    //home
      .state('console', {
        url: '/console',
        templateUrl: 'views/console.html',
        controller: 'ConsoleCtrl',
        abstract: true,
        resolve:{

          absi: ['allbsi', function(allbsi){
            return allbsi.query().$promise;
          }],
          colsso: ['sso', function(sso){
            return sso.get().$promise;
          }],
          tree: ['tenantname','Cookie', function(tenantname,Cookie){
            return tenantname.query({name:Cookie.get('username')}).$promise;
          }],
        }

      })
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        abstract: true,
        resolve:{
          homesso: ['sso', function(sso){
            return sso.get().$promise;
          }]
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl',
        resolve:{
        }
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'registerCtrl',
        resolve:{
        }
      })
      .state('home.platform', {
        url: '/platform',
        templateUrl: 'views/platform.html',
        controller: 'PlatformCtrl',

      })
      .state('home.permission', {
        url: '/permission',
        templateUrl: 'views/permission.html',
        controller: 'PermissionCtrl',

      })
      .state('console.tenant', {
        url: '/tenant',
        templateUrl: 'views/tenant.html',
        controller: 'TenantCtrl',

      })
      .state('console.role', {
      url: '/role',
      templateUrl: 'views/role.html',
      controller: 'RoleCtrl',

    })
      .state('console.service', {
      url: '/service',
      templateUrl: 'views/service.html',
      controller: 'ServiceCtrl',

    })
      .state('console.user', {
      url: '/user',
      templateUrl: 'views/user.html',
      controller: 'UserCtrl',

    });


  }]);
