/**
 * Created by sorcerer on 2017/6/7.
 */
"use strict";
angular.module('basic.services', ['ngResource'])
  .service('Cookie', [function () {
    this.set = function (key, val, expires) {
      let date = new Date();
      date.setTime(date.getTime() + expires);
      document.cookie = key + "=" + val + "; expires=" + date.toUTCString();
    };
    this.get = function (key) {
      let reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
      let arr = document.cookie.match(reg);
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
      let CODE_MAPPING = {
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
          let tenantId = Cookie.get("tenantId");
          let username = Cookie.get("username");
          if (config.headers) {
            config.headers.tenantId = tenantId;
            config.headers.username = username;
          }
          if (config.headers) {
            config.headers["http_x_proxy_cas_loginname"] = "like";
            config.headers["http_x_proxy_cas_username"] = "like";
          }
          if (config.headers) {
            config.headers["token"] = Cookie.get('token');
          }
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
          $rootScope.loading = false;
          let val = CODE_MAPPING[response.status];
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
          let closeConf = function () {
            $uibModalInstance.close()
          }
          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            deletetenantapi.delete({id: id}, function () {
              $scope.con = '删除成功';
              window.setTimeout(closeConf, 1500);
            }, function (res) {
              $scope.con = '删除失败!';
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
            $scope.newUser.name = nameobj.oldUser;
            $scope.newRole = nameobj.oldRole;
            $scope.newUserId = nameobj.oldUserId;
            $scope.description = nameobj.description;
            $scope.isAdd = nameobj.isAdd;
            $scope.isUserOk = false;
            $scope.change = function () {
              $scope.noResults = true;
            }
            $scope.ok = function () {
              if ($scope.isUserOk === true) {
                return;
              }
              $scope.isUserOk = true;
              let closeConf = function () {
                $uibModalInstance.close();
              }
              if ($scope.isAdd) {
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
              }
            })
            $scope.xuanze = function (a, b, c, d) {
              $scope.newUser.name = b;
              $scope.newUserId = a.id;
            };
            $scope.changeUser = function (item, e) {
              $scope.newUser.name = item;
              $scope.newUserId = e;
            };
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
      let CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      let chars = CHARS, uuid = [], i;
      radix = radix || chars.length;
      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
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
                if (!type.type) {
                  $scope.isladp = true;
                  ladptype.query({}, function (data) {
                    $scope.ladpname = [];
                    $scope.input.username = data[0];
                    angular.forEach(data, function (name, i) {
                      $scope.ladpname.push({name: name})
                    })
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
            $scope.checkEmail = function (email) {
              let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
              if (!email) {
                $scope.emailErrInfo = '邮箱不能为空';
                $scope.error.emailnull = true;
                return false;
              } else if (!reg.test(email)) {
                $scope.emailErrInfo = '邮箱不正确';
                $scope.error.emailnull = true;
                return false;
              } else {
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
                $scope.error.emailnull = false;
              }
              if (!$scope.isupdata && !$scope.isladp) {
                if (n.password && n.password.length > 0) {
                  $scope.error.passwordnull = false;
                }
              }
            }, true);
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.isOk = false;
            let closeConf = function () {
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
  .service('user_change_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (item, userArr) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/user_change_Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
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
  .service('user_del_Confirm', ['$uibModal', function ($uibModal) {
    this.open = function (name, id) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/user_del_Confirm.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', 'user', function ($scope, $uibModalInstance, user) {
          $scope.con = '确认删除' + name;
          let closeConf = function () {
            $uibModalInstance.close()
          }
          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            user.delete({id: id}, function () {
              $scope.con = '删除成功';
              window.setTimeout(closeConf, 1500);
            }, function (res) {
              if (res.data.resCodel === 4001) {
                $scope.con = '该用户并非由您创建，您无权删除该用户!';
              } else if (res.data.resCodel === 4002) {
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
              $scope.error.servicenamenull = false;
            }
            if (n.serviceuser && n.serviceuser.length > 0) {
              $scope.error.serviceusernull = false;
            }
            if (n.servicepassword && n.servicepassword.length > 0) {
              $scope.error.servicepasswordnull = false;
            }
            if (n.serviceurl && n.serviceurl.length > 0) {
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
        controller: ['$scope', '$uibModalInstance', 'addtenantapi', 'Cookie', 'getdfbs',
          function ($scope, $uibModalInstance, addtenantapi, Cookie, getdfbs) {
            let timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            let username = Cookie.get("username")
            $scope.isbs = false;
            $scope.nextDiv = function () {
              $scope.isbs = true;
            }
            $scope.message = {
              id: username + '-' + timestamp,
              name: '',
              description: '',
              parentId: id,
              quota: {}
            };

            function isEmptyObject(obj) {
              for (let key in obj) {
                return false
              }
              ;
              return true
            };
            $scope.bslength = 0;
            getdfbs.get(function (data) {
              $scope.bsList = {};
              $scope.newbsobj = {};
              angular.forEach(data.items, function (bs, i) {
                if (isEmptyObject(bs.spec.plans[0].metadata.customize)) {
                } else {
                  let atson = {
                    name: bs.metadata.name,
                    quota: []
                  };
                  $scope.bsList[bs.metadata.name] = {};
                  $scope.bslength += 1
                  angular.forEach(bs.spec.plans[0].metadata.customize, function (ct, y) {
                    let obj = {
                      key: y,
                      val: 0
                    }
                    $scope.bsList[bs.metadata.name][y] = 0;
                    atson.quota.push(obj);
                  });
                  $scope.newbsobj[bs.metadata.name] = atson.quota
                }
              });
            })
            $scope.changeList =
              {}
            $scope.changeBs = function (bskey, bsval) {
              $scope.changeList[bskey] = bsval;
              angular.forEach($scope.bsList, function (bs, i) {
                angular.forEach($scope.changeList, function (clickbs, k) {
                  if (i === k) {
                    $scope.bslength = $scope.bslength - 1
                    delete $scope.bsList[k];
                  }
                })
              })
            }
            $scope.delbsList = function (val, idx) {
              delete $scope.changeList[val];
              $scope.bslength += 1;
              angular.forEach($scope.newbsobj, function (bs, k) {
                angular.forEach(bs, function (bsquo, k) {
                  bsquo.val = 0;
                })
                if (k === val) {
                  $scope.bsList[k] = bs;
                }
              })
            }
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.set_use = false;
            $scope.ok = function () {
              let postobj = {};
              angular.forEach($scope.newbsobj, function (bs, i) {
                postobj[i.toLowerCase()] = {}
                angular.forEach(bs, function (item, k) {
                  postobj[i.toLowerCase()][item.key] = item.val - 0;
                })
              })
              $scope.message.quota = JSON.stringify(postobj);
              addtenantapi.post($scope.message, function (data) {
                $uibModalInstance.close(data);
              }, function (error) {
                if (error.data && error.data.resCodel === 4061) {
                  $scope.set_use = true;
                }
              });
            };
          }]
      }).result;
    };
  }])
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
            $scope.bsiname = '';
            $scope.bsiurl = '';
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.set_use = false;
            $scope.ok = function () {
              let obj = {}
              if (data[$scope.svActive].spec.plans[0] && data[$scope.svActive].spec.plans[0].metadata.customize) {
                for (let k in data[$scope.svActive].spec.plans[0].metadata.customize) {
                  obj[k] = data[$scope.svActive].spec.plans[0].metadata.customize[k].default.toString()
                }
              }
              let username = Cookie.get("username")
              let bsiobj = {
                "kind": "BackingServiceInstance",
                "apiVersion": "v1",
                "metadata": {
                  "name": $scope.bsiname,
                },
                "spec": {
                  "provisioning": {
                    "backingservice_name": data[$scope.svActive].metadata.name,
                    "backingservice_plan_guid": data[$scope.svActive].spec.plans[0].id,
                    "parameters": obj
                  }
                }
              }
              bsiobj.spec.provisioning.parameters.cuzBsiName = $scope.bsiurl
              creatbsi.post({id: id}, bsiobj, function (data) {
                $uibModalInstance.close(true);
              }, function (error) {
                if (error.data && error.data.resCodel === 4061) {
                  $scope.set_use = true;
                }
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
              let putobj = {
                password: $scope.password
              }
              putuser.updata({name: name}, putobj, function (data) {
                $uibModalInstance.close(true);
              })
            };
          }]
      }).result;
    };
  }])
  .service('addBsi', ['$uibModal', function ($uibModal) {
    this.open = function (name, item, id) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/add_bsi.html',
        size: 'default',
        controller: ['creatbsi', 'Cookie', '$scope', '$uibModalInstance', 'getdfbs',
          function (creatbsi, Cookie, $scope, $uibModalInstance, getdfbs) {
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.bsiobj = {
              "kind": "BackingServiceInstance",
              "apiVersion": "v1",
              "metadata": {
                "name": '',
              },
              "spec": {
                "provisioning": {}
              }
            }
            $scope.tenurl = ''
            getdfbs.get(function (data) {
              angular.forEach(data.items, function (bs, i) {
                if (bs.metadata.name === name) {
                  let obj = {}
                  if (bs.spec.plans[0] && bs.spec.plans[0].metadata.customize) {
                    for (let k in bs.spec.plans[0].metadata.customize) {
                      obj[k] = bs.spec.plans[0].metadata.customize[k].default.toString()
                    }
                  }
                  let username = Cookie.get("username")
                  $scope.bsiobj.spec.provisioning = {
                    "backingservice_name": bs.metadata.name,
                    "backingservice_plan_guid": bs.spec.plans[0].id,
                    "parameters": obj
                  }
                }
              })
            })
            $scope.ok = function () {
              $scope.bsiobj.spec.provisioning.parameters.cuzBsiName = $scope.tenurl;
              creatbsi.post({id: id}, $scope.bsiobj, function (data) {
                $uibModalInstance.close(data);
              })
            };
          }]
      }).result;
    };
  }])
  .service('smallAlert', ['$uibModal', function ($uibModal) {
    this.open = function (con) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/small_alert.html',
        size: 'default small_alert',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.con = con;
          let closeConf = function () {
            $uibModalInstance.close();
          }
          window.setTimeout(closeConf, 1500);
        }]
      }).result;
    };
  }])
  .service('bsLimit', ['$uibModal', function ($uibModal) {
    this.open = function () {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/tpl/bs_limit.html',
        size: 'default',
        controller: ['$scope', '$uibModalInstance', 'getdfbs', function ($scope, $uibModalInstance, getdfbs) {
          getdfbs.get(function (data) {
            $scope.bsList = {};
            $scope.newbsobj = [];
            angular.forEach(data.items, function (bs, i) {
              let atson = {
                name: bs.metadata.name,
                quota: []
              };
              $scope.bsList[bs.metadata.name] = {};
              angular.forEach(bs.spec.plans[0].metadata.customize, function (ct, y) {
                let obj = {
                  key: y,
                  val: 0
                }
                $scope.bsList[bs.metadata.name][y] = 0;
                atson.quota.push(obj);
              });
              $scope.newbsobj.push(atson);
            });
          })
          $scope.changeList =
            {}
          $scope.changeBs = function (bskey, bsval) {
            $scope.changeList[bskey] = bsval;
          }
          $scope.delbsList = function (val, idx) {
            delete $scope.changeList[val];
            angular.forEach($scope.newbsobj[idx].quota, function (ct, y) {
              ct.val = 0;
            });
          }
          $scope.cancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.ok = function () {
            angular.forEach($scope.changeList, function (ct, i) {
              let qa = {};
              angular.forEach($scope.newbsobj, function (arr, y) {
                if (i === arr.name) {
                  angular.forEach(arr.quota, function (quota, z) {
                    qa[quota.key] = quota.val;
                  });
                }
              });
              $scope.changeList[i] = qa;
            });
          };
        }]
      }).result;
    };
  }]);
