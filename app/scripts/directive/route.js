'use strict';
/**
 * Created by sorcerer on 2017/6/1.
 */
angular.module('basic.router', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/console/tenant");
    $stateProvider
      .state('console', {
        url: '/console',
        templateUrl: 'views/console.html',
        controller: 'ConsoleCtrl',
        abstract: true,
        resolve: {
          absi: ['allbsi', function (allbsi) {
            return allbsi.query().$promise;
          }],
          tree: ['tenantname', 'Cookie', function (tenantname, Cookie) {
            return tenantname.query({name: Cookie.get('username')}).$promise;
          }],
        }
      })
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        abstract: true,
        resolve: {}
      })
      .state('home.login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl',
        resolve: {}
      })
      .state('home.permission', {
        url: '/permission',
        templateUrl: 'views/permission.html',
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
