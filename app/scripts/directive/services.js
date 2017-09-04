/**
 * Created by sorcerer on 2017/6/7.
 */
"use strict";
angular.module('basic.services', ['ngResource'])
  .service('Cookie', [function () {
    this.set = function (key, val, expires) {
      var date = new Date();
      date.setTime(date.getTime() + expires);
      document.cookie = key + "=" + val + "; expires=" + date.toUTCString();
    };
    this.get = function (key) {
      var reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
      var arr = document.cookie.match(reg);
      if (arr) {
        return (arr[2]);
      }
      return null;
    };
    this.clear = function (key) {
      this.set(key, "", -1);
    };
  }])
  .factory('AuthInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', 'Cookie',
    function ($rootScope, $q, AUTH_EVENTS, Cookie) {
      var CODE_MAPPING = {
        401: AUTH_EVENTS.loginNeeded,
        403: AUTH_EVENTS.httpForbidden,
        419: AUTH_EVENTS.loginNeeded,
        440: AUTH_EVENTS.loginNeeded
      };
      return {
        request: function (config) {
          if (/^\/login/.test(config.url)) {
            return config;
          }
          //if (/^\/signin/.test(config.url)) {
          //  return config;
          //}
          //$rootScope.region=
          //var tokens = Cookie.get('df_access_token');
          //var regions = Cookie.get('region');
          //var token = '';
          ////console.log(tokens);
          //
          //if (tokens && regions) {
          //  var tokenarr = tokens.split(',');
          //  var region = regions.split('-')[2];
          //  //if (/^\/lapi\/v1\/orgs/.test(config.url)) {
          //  //    console.log(config.url);
          //  //}
          //
          //  if (/^\/lapi\/v1\/orgs/.test(config.url) || /^\/oapi/.test(config.url) || /^\/api/.test(config.url) || /^\/payment/.test(config.url) || /^\/v1\/repos/.test(config.url)) {
          //
          //    token = tokenarr[region - 1];
          //  } else {
          //    token = tokenarr[0];
          //  }
          //
          //  //console.log('tokenarr', tokenarr[region-1]);
          //} else {
          //  //console.log('token错误');
          //}
          //console.log(tokens,token, regions);
          var tenantId = Cookie.get("tenantId");
          var username = Cookie.get("username");
          //console.log('username', username);
          if (config.headers) {
            config.headers.tenantId = tenantId;
            config.headers.username = username;
          }
          if (config.headers) {
            config.headers["http_x_proxy_cas_loginname"] = "like";
            config.headers["http_x_proxy_cas_username"] = "like";
          }
          //console.log('config', config);
          if (config.headers) {
            config.headers["token"] = Cookie.get('token');
          }
          //if (config.headers) {
          //  config.headers["Authorization"] = "Bearer " + token;
          //}
          //
          //if (/^\/hawkular/.test(config.url)) {
          //  config.headers["Hawkular-Tenant"] = $rootScope.namespace;
          //}
          //if (/^\/registry/.test(config.url)) {
          //  var Auth = localStorage.getItem("Auth")
          //  config.headers["Authorization"] = "Basic " + Auth;
          //}
          //if (config.method == 'PATCH') {
          //  config.headers["Content-Type"] = "application/merge-patch+json";
          //}
          //console.log('config.url', config.url);
          $rootScope.loading = true;
          return config;
        },
        requestError: function (rejection) {
          $rootScope.loading = false;
          return $q.reject(rejection);
        },
        response: function (res) {
          $rootScope.loading = false;
          return res;
        },
        responseError: function (response) {
          //alert(11)
          $rootScope.loading = false;
          var val = CODE_MAPPING[response.status];
          if (val) {
            $rootScope.$broadcast(val, response);
          }
          return $q.reject(response);
        }
      };
    }])
  .service('tenant_del_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (name, id) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/tenant_del_Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', 'deletetenantapi', function ($scope, $uibModalInstance, deletetenantapi) {


          $scope.con = '确认删除' + name;
          var closeConf = function () {
            $uibModalInstance.close()
          }
          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            console.log('id', id);
            deletetenantapi.delete({id: id}, function () {
              $scope.con = '删除成功';
              window.setTimeout(closeConf, 1500);
            }, function (res) {
              // console.log('111',res);
              //if (res.data.resCodel == 4001) {
              //  $scope.con = '该用户并非由您创建，您无权删除该用户!';
              //} else if (res.data.resCodel == 4002) {
              //  $scope.con = '该用户已被绑定角色，请解绑后再进行删除!';
              //} else {
              $scope.con = '删除失败!';
              //}
              window.setTimeout(closeConf, 2000);
            });

          };
        }]
      }).result;
    };
  }])

  .service('Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (userList, roleList, nameobj) {
      return $uibModal.open({
        templateUrl: 'views/tpl/Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', 'cGtenantuser',
          function ($scope, $uibModalInstance, cGtenantuser) {
            $scope.userList = userList;
            $scope.roleList = roleList;
            $scope.newUser = {}
            //console.log(userList, roleList, nameobj);
            $scope.newUser.name = nameobj.oldUser;
            $scope.newRole = nameobj.oldRole;
            $scope.newUserId = nameobj.oldUserId;
            $scope.description = nameobj.description;
            $scope.isAdd = nameobj.isAdd;
            $scope.isUserOk = false;
            console.log('$scope.isopen', $scope.noResults);

            $scope.change = function () {
              //alert(1)
              console.log('noResults', $scope.noResults);
              $scope.noResults = true;
            }
            $scope.ok = function () {
              if ($scope.isUserOk === true) {
                return;
              }
              $scope.isUserOk = true;
              var closeConf = function () {
                $uibModalInstance.close();
              }
              if ($scope.isAdd) {
                console.log('nameobj.newUser', $scope.newUser.name);
                cGtenantuser.post({id: nameobj.nodeId}, {
                  "userId": $scope.newUserId,
                  "roleId": $scope.newRole
                }, function (res) {
                  res.userName = $scope.newUser.name;
                  $uibModalInstance.close(res);
                }, function () {
                  $scope.isUserOk = false;
                });
              } else {
                cGtenantuser.put({id: nameobj.nodeId}, {
                  "userId": $scope.newUserId,
                  "roleId": $scope.newRole
                }, function (res) {
                  $uibModalInstance.close(res);
                }, function () {
                  $scope.isUserOk = false;
                  window.setTimeout(closeConf, 1500);
                });
              }
            };
            $scope.$watch('newUser', function (n, o) {
              if (n === o) {
                return
              }
              if (n) {
                console.log('n', n);
              }
            })
            $scope.xuanze = function (a, b, c, d) {
              //console.log(a, b, c, d);
              $scope.newUser.name = b;
              $scope.newUserId = a.id;
            };
            // 选择用户
            $scope.changeUser = function (item, e) {
              //console.log('item.username', item);
              $scope.newUser.name = item;
              $scope.newUserId = e;
            };
            // 选择角色
            $scope.changeRole = function (id) {
              $scope.newRole = id;
            };
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
          }]
      }).result;
    };
  }])
  .service('newconfirm', ['$uibModal', function ($uibModal) {
    this.open = function (datacon, status) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/newconfirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {


          $scope.con = datacon;
          if (status) {
            $scope.status = status;
          }

          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            $uibModalInstance.close(true);
          };
        }]
      }).result;
    };
  }])
  .service('infoconfirm', ['$uibModal', function ($uibModal) {
    this.open = function (datacon) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/infoconfirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {


          $scope.con = datacon;


          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            $uibModalInstance.close(true);
          };
        }]
      }).result;
    };
  }])
  .service('uuid', ['$uibModal', function ($uibModal) {
    this.num = function (len, radix) {
      var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var chars = CHARS, uuid = [], i;
      radix = radix || chars.length;

      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }

      return uuid.join('');
    };


  }])
  .service('delconfirm', ['$uibModal', function ($uibModal) {
    this.open = function (title, roleId, userId, username) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/delConfirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', 'deltenantuser', function ($scope, $uibModalInstance, deltenantuser) {


          $scope.title = title;
          $scope.userId = userId;
          $scope.username = username;

          $scope.cancel = function () {
            $uibModalInstance.dismiss();
            $scope.delfail = false;
          };
          $scope.delfail = false;
          $scope.ok = function () {
            deltenantuser.delete({id: roleId, userId: userId}, {}, function (res) {
              $uibModalInstance.close(res);
            }, function () {
              $scope.delfail = true;
            });
          };
        }]
      }).result;
    };
  }])
  .service('Alert', ['$uibModal', function ($uibModal) {
    this.open = function (con) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/Alert.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.con = con;
          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            $uibModalInstance.dismiss();
          };
        }]
      }).result;
    };
  }])
  //用户管理 -  添加用户
  .service('user_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (item, userArr) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/user_Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', 'user', 'putuser', 'authctype', 'ladptype',
          function ($scope, $uibModalInstance, user, putuser, authctype, ladptype) {
            $scope.userErrInfo = '用户名不能为空';
            $scope.emailErrInfo = '邮箱不能为空';
            $scope.thisTitle = '';
            if (item) {
              $scope.isupdata = true;
              $scope.input = item;
              $scope.thisTitle = '修改用户';
            } else {
              $scope.isupdata = false;
              $scope.userArr = userArr;
              $scope.thisTitle = '添加用户';
              $scope.input = {
                username: '',
                email: '',
                password: '',
                description: ''
              };
              authctype.get({}, function (type) {
                //console.log('type', type);
                //type.type=1
                if (!type.type) {
                  $scope.isladp = true;
                  ladptype.query({}, function (data) {
                    $scope.ladpname = [];
                    $scope.input.username = data[0];
                    angular.forEach(data, function (name, i) {
                      $scope.ladpname.push({name: name})

                    })
                    //
                    //console.log('data', data);


                  })
                } else {
                  $scope.isladp = false
                }

              })
            }

            $scope.error = {
              namenull: false,
              emailnull: false,
              passwordnull: false
            };
            $scope.resErr = {
              info: '',
              status: false
            }
            $scope.checkEmail = function(email){
              var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
              if(!email){
                $scope.emailErrInfo = '邮箱不能为空';
                $scope.error.emailnull = true;
                return false;
              }else if(!reg.test(email)){
                $scope.emailErrInfo = '邮箱不正确';
                $scope.error.emailnull = true;
                return false;
              }else{
                return true;
              }

            }
            $scope.$watch('input', function (n, o) {
              if (n === o) {
                return;
              }
              if (n.username && n.username.length > 0) {
                $scope.error.namenull = false;
                if ($scope.userArr) {
                  angular.forEach($scope.userArr, function (user, i) {
                    if (user.username === n.username) {
                      $scope.error.namenull = true;
                      $scope.userErrInfo = '用户名已存在';
                    }
                  })
                }
              } else {
                $scope.error.namenull = true;
                $scope.userErrInfo = '用户名不能为空';
              }
              if (n.email && n.email.length > 0) {
                //console.log('n', n);
                $scope.error.emailnull = false;
              }
              if (!$scope.isupdata && !$scope.isladp) {
                if (n.password && n.password.length > 0) {
                  //console.log('n', n);
                  $scope.error.passwordnull = false;
                }
              }

            }, true);

            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.isOk = false;
            var closeConf = function () {
              $uibModalInstance.close();
            }
            $scope.ok = function () {

              if ($scope.isOk === true) {
                return;
              }

              if ($scope.input.username === '') {
                $scope.error.namenull = true;
                $scope.userErrInfo = '用户名不能为空';
                $scope.isOk = false;
                return;
              }
              if (!$scope.isupdata && !$scope.isladp) {
                if ($scope.input.password === '') {
                  $scope.error.passwordnull = true;
                  $scope.isOk = false;
                  return;
                }
              }
              if ($scope.input.email === '') {
                $scope.error.emailnull = true;
                $scope.isOk = false;
                return;
              }


              if ($scope.error.namenull || $scope.error.emailnull || $scope.error.passwordnull || !$scope.checkEmail($scope.input.email)) {
                return;
              }

              //console.log('$scope.input', $scope.input);
              $scope.isOk = true;
              if ($scope.isupdata) {
                $scope.putapi = angular.copy($scope.input);
                delete $scope.putapi.password
                putuser.updata({name: $scope.putapi.username}, $scope.putapi, function () {
                  $uibModalInstance.close(true);
                }, function (res) {
                  if (res.data.resCodel == 4004) {
                    $scope.resErr.info = '该用户并非由您创建，您无权编辑该用户信息';
                  } else {
                    $scope.resErr.info = '修改失败！';
                  }
                  $scope.resErr.status = true;
                  window.setTimeout(closeConf, 2000);
                  $scope.isOk = false;
                });
              } else {
                //console.log('111');

                user.create($scope.input, function () {
                  $uibModalInstance.close(true);
                }, function (res) {
                  if (res.data.resCodel == 4003) {
                    $scope.resErr.info = '您没有权限添加用户！';
                  } else {
                    $scope.resErr.info = '添加失败！';
                  }
                  $scope.resErr.status = true;
                  window.setTimeout(closeConf, 2000);
                  $scope.isOk = false;

                });
              }
            };
          }]
      }).result;
    };
  }])
  //用户管理 -  修改
  .service('user_change_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (item, userArr) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/user_change_Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

          //console.log('item', item);
          $scope.username = item.username;
          $scope.email = item.email;
          $scope.description = item.description;

          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {

            $uibModalInstance.close(true);
          };
        }]
      }).result;
    };
  }])
  //用户管理 -  删除
  .service('user_del_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (name, id) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/user_del_Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', 'user', function ($scope, $uibModalInstance, user) {


          $scope.con = '确认删除' + name;
          var closeConf = function () {
            $uibModalInstance.close()
          }
          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            console.log('id', id);
            user.delete({id: id}, function () {
              $scope.con = '删除成功';
              window.setTimeout(closeConf, 1500);
            }, function (res) {
              // console.log('111',res);
              if (res.data.resCodel == 4001) {
                $scope.con = '该用户并非由您创建，您无权删除该用户!';
              } else if (res.data.resCodel == 4002) {
                $scope.con = '该用户已被绑定角色，请解绑后再进行删除!';
              } else {
                $scope.con = '删除失败!';
              }
              window.setTimeout(closeConf, 2000);
            });

          };
        }]
      }).result;
    };
  }])

  //服务管理 -  添加
  .service('service_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (datacon) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/service_Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.input = {
            servicename: '',
            serviceuser: '',
            servicepassword: '',
            serviceurl: ''

          };
          $scope.error = {
            servicenamenull: false,
            serviceusernull: false,
            servicepasswordnull: false,
            serviceurlnull: false
          };

          $scope.con = datacon;
          $scope.$watch('input', function (n, o) {
            if (n === o) {
              return;
            }
            if (n.servicename && n.servicename.length > 0) {
              console.log('n', n);
              $scope.error.servicenamenull = false;
            }
            if (n.serviceuser && n.serviceuser.length > 0) {
              console.log('n', n);
              $scope.error.serviceusernull = false;
            }
            if (n.servicepassword && n.servicepassword.length > 0) {
              console.log('n', n);
              $scope.error.servicepasswordnull = false;
            }
            if (n.serviceurl && n.serviceurl.length > 0) {
              console.log('n', n);
              $scope.error.serviceurlnull = false;
            }

          }, true);

          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            if ($scope.input.servicename === '' && $scope.input.serviceuser === '' && $scope.input.servicepassword === '' && $scope.input.serviceurl === '') {
              $scope.error.servicenamenull = true;
              $scope.error.serviceusernull = true;
              $scope.error.servicepasswordnull = true;
              $scope.error.serviceurlnull = true;
              return;
            }
            if ($scope.input.servicename === '') {
              $scope.error.servicenamenull = true;
              return;
            }
            if ($scope.input.serviceuser === '') {
              $scope.error.serviceusernull = true;
              return;
            }
            if ($scope.input.servicepassword === '') {
              $scope.error.servicepasswordnull = true;
              return;
            }
            if ($scope.input.serviceurl === '') {
              $scope.error.serviceurlnull = true;
              return;
            }
            $uibModalInstance.close(true);


          };


        }]
      }).result;
    };
  }])

  //服务管理 -  修改
  .service('service_change_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (datacon) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/service_change_Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {


          $scope.con = datacon;

          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            $uibModalInstance.close(true);
          };
        }]
      }).result;
    };
  }])

  //服务管理 -  删除
  .service('service_del_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (datacon) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/service_del_Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {


          $scope.con = datacon;

          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            $uibModalInstance.close(true);
          };
        }]
      }).result;
    };
  }])
  .service('addTenant', ['$uibModal', function ($uibModal) {
    this.open = function (id) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/addTenant.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', 'addtenantapi', 'Cookie',
          function ($scope, $uibModalInstance, addtenantapi, Cookie) {
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            //var newid = id;
            var username = Cookie.get("username")
            //if (id.indexOf(username)) {
            //  newid=newid.split(username)[0]
            //}
            $scope.message = {
              id: username + '_' + timestamp,
              name: '',
              description: '',
              parentId: id
            }
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.ok = function () {

              addtenantapi.post($scope.message, function (data) {
                //alert(data)
                //console.log('data111', data);

                $uibModalInstance.close(data);
              });

            };
          }]
      }).result;
    };
  }])
  //添加服务
  .service('addserve_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (data, id) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/addserve.html',
        size: 'default',
        controller: ['uuid', '$scope', '$uibModalInstance', 'creatbsi', 'Cookie',
          function (uuid, $scope, $uibModalInstance, creatbsi, Cookie) {
            $scope.data = data;
            $scope.svList = true;
            $scope.svName = 'HBase';
            $scope.svActive = 0;
            $scope.nextDiv = function () {
              $scope.svList = false;
            }
            $scope.checkSv = function (val, idx) {
              $scope.svName = val;
              $scope.svActive = idx;

            }
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.ok = function () {
              console.log('bsid', data[$scope.svActive].spec.plans[0].id);
              //console.log('bsid', data[$scope.svActive].spec.plans[0].id);
              var obj = {}

              if (data[$scope.svActive].spec.plans[0] && data[$scope.svActive].spec.plans[0].metadata.customize) {
                for (var k in data[$scope.svActive].spec.plans[0].metadata.customize) {
                  // console.log(k, data[$scope.svActive].spec.plans[0].metadata.customize[k]);
                  obj[k] = data[$scope.svActive].spec.plans[0].metadata.customize[k].default.toString()
                }
              }
              //var timestamp = Date.parse(new Date());
              //timestamp = timestamp / 1000;
              //var newid = id;
              var username = Cookie.get("username")
              var bsiobj = {
                "kind": "BackingServiceInstance",
                "apiVersion": "v1",
                "metadata": {
                  "name": data[$scope.svActive].metadata.name + '_' + username + '_' + uuid.num(7, 16),
                },
                "spec": {
                  "provisioning": {
                    "backingservice_name": data[$scope.svActive].metadata.name,
                    "backingservice_plan_guid": data[$scope.svActive].spec.plans[0].id,
                    "parameters": obj
                  }
                }
              }

              creatbsi.post({id: id}, bsiobj, function (data) {
                console.log('data', data);
                $uibModalInstance.close(true);
              })

            };
          }]
      }).result;
    };
  }])
  .service('updatepwd', ['$uibModal', function ($uibModal) {
    this.open = function (name) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/updatepwd.html',
        size: 'default',
        controller: ['putuser', '$scope', '$uibModalInstance',
          function (putuser, $scope, $uibModalInstance) {
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.ok = function () {
              var putobj = {
                password:$scope.password
              }
              putuser.updata({name:name},putobj, function (data) {
                console.log('data', data);
                $uibModalInstance.close(true);
              })

            };
          }]
      }).result;
    };
  }])
  //添加实例
  .service('addBsi', ['$uibModal', function ($uibModal) {
    this.open = function (name,item,id) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/add_bsi.html',
        size: 'default',
        controller: ['creatbsi','Cookie','$scope', '$uibModalInstance','getdfbs', function (creatbsi,Cookie,$scope, $uibModalInstance,getdfbs) {
          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.bsiobj = {
            "kind": "BackingServiceInstance",
            "apiVersion": "v1",
            "metadata": {
              "name":'',
            },
            "spec": {
              "provisioning":{}
            }
          }
          $scope.tenurl=''

          getdfbs.get(function (data) {
            //data.items
            angular.forEach(data.items, function (bs, i) {
              if (bs.metadata.name === name) {
                var obj = {}

                if (bs.spec.plans[0] && bs.spec.plans[0].metadata.customize) {
                  for (var k in bs.spec.plans[0].metadata.customize) {
                    // console.log(k, data[$scope.svActive].spec.plans[0].metadata.customize[k]);
                    obj[k] = bs.spec.plans[0].metadata.customize[k].default.toString()
                  }
                }
                var username = Cookie.get("username")
                $scope.bsiobj.spec.provisioning={
                  "backingservice_name": bs.metadata.name,
                  "backingservice_plan_guid": bs.spec.plans[0].id,
                  "parameters": obj
                }
              }
            })
          })
          $scope.ok = function () {
            $scope.bsiobj.spec.provisioning.parameters.cuzBsiName=$scope.tenurl;
            creatbsi.post({id: id}, $scope.bsiobj, function (data) {
              console.log('data', data);

              $uibModalInstance.close(data);
            })

          };
        }]
      }).result;
    };
  }])
