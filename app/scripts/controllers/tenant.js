'use strict';

/**
 * Controller of the dashboard
 */
angular.module('basic')
  .controller('TenantCtrl', ['uuid', 'deletebsi', 'creatbsi', 'getplan', 'updateinstance', 'addserve_Confirm', 'tenantname', 'tenant_del_Confirm', 'addTenant', '$rootScope', '$scope', 'Confirm', 'newconfirm', 'tenant', 'delconfirm', 'tenantchild', 'tree', 'tenantuser', 'tenantbsi', 'bsidata', 'user', 'serveinfo', 'Alert', 'service', 'absi', 'Cookie', 'userole', '$state', 'userinfo', 'infoconfirm', 'getdfbs',
    function (uuid, deletebsi, creatbsi, getplan, updateinstance, addserve_Confirm, tenantname, tenant_del_Confirm, addTenant, $rootScope, $scope, Confirm, newconfirm, tenant, delconfirm, tenantchild, tree, tenantuser, tenantbsi, bsidata, user, serveinfo, Alert, service, absi, Cookie, userole, $state, userinfo, infoconfirm, getdfbs) {
      Array.prototype.unique = function () {
        var res = [this[0]];
        for (var i = 1; i < this.length; i++) {
          var repeat = false;
          for (var j = 0; j < res.length; j++) {
            if (this[i] == res[j]) {
              repeat = true;
              break;
            }
          }
          if (!repeat) {
            res.push(this[i]);
          }
        }
        return res;
      }

      //左边导航自动变化
      var left_by_block = function () {
        var thisheight = $(window).height() - 80;
        $('.tree-classic').css('min-height', thisheight);
      };
      $scope.deltenan = function (e, node) {
        e.stopPropagation();
        tenant_del_Confirm.open(node.name, node.id).then(function () {
          gettree()
        });
        //console.log('node', node);
      }
      function gettree() {
        tenantname.query({name: Cookie.get('username')}, function (tree) {
          creattree(tree)
        })
      }
      $scope.looklog = function (name) {
        userinfo.query({name: name, id: Cookie.get('tenantId')}, function (res) {
          console.log('resinfo', res);
          infoconfirm.open(res)
        })
      }
      $(window).resize(function () {
        left_by_block();
      });
      var out = ["hdfs", "hbase", "hive", "mapreduce", "spark", "kafka"];
      $(function () {
        left_by_block();
      });
      if (tree[0] && tree[0].id) {
        $scope.nodeId = tree[0].id;
      }
      console.log('tree', tree);
      if (tree && tree.length === 0) {

        $state.go('home.permission');
      }
      $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        allowDeselect: false,
        injectClasses: {
          ul: "a1",
          li: "a2",
          liSelected: "a7",
          iExpanded: "a3",
          iCollapsed: "a4",
          iLeaf: "a5",
          label: "a6",
          labelSelected: "a8"
        }
      };
      // $scope.selected = tree[0];

      $scope.ismember = true;
      var allbsi = [];
      angular.forEach(absi, function (bsi) {
        //console.log('bsi', bsi);
        if (bsi.status !== 'Failure') {
          allbsi.push(bsi)
        }
      })
      absi = angular.copy(allbsi)
      angular.forEach(tree, function (tre) {
        //console.log('tre', tre);
        tre.bsis = [];
        angular.forEach(absi, function (bsi) {
          if (tre.id === bsi.tenantId) {
            tre.bsis.push(bsi);
          }
        });
      });

//console.log('absi', absi);
      angular.forEach(absi, function (bsi) {
        //console.log('bsi', bsi);
        //console.log("sssssssss",bsi.quota,typeof bsi.quota);
        if (bsi.quota && typeof bsi.quota === "string") {
          //console.log('bsi', bsi.quota);
          try {
            bsi.quota = JSON.parse(bsi.quota);

          } catch (e) {
            //console.log(e);
            //return false;
          }

        }
      });

      angular.forEach(absi, function (bsi) {
        if (bsi.quota) {
          angular.forEach(bsi.quota, function (quota, k) {
            if (k && k === 'instance_id') {
              bsi.instance_id = quota
              delete bsi.quota[k];
            }
          })
        }
      })

      //console.log('absi1212121', absi);


      //console.log('$scope.dataForTheTree', $scope.dataForTheTree);


      //console.log('$scope.dataForTheTree', $scope.dataForTheTree);
      var refresh = function (page) {
        var skip = (page - 1) * $scope.grid.bsisize;
        if ($scope.bsis.length) {
          $scope.bsisitem = $scope.bsis.slice(skip, skip + $scope.grid.bsisize);
        } else {
          $scope.bsisitem = [];
        }
        $(window).scrollTop(0);
      };
      var refreshuser = function (page) {
        var skip = (page - 1) * $scope.grid.usersize;
        if ($scope.users.length) {
          $scope.useritem = $scope.users.slice(skip, skip + $scope.grid.usersize);
        } else {
          $scope.useritem = [];
        }
        $(window).scrollTop(0);
      };
      $scope.$watch('grid.bsipage', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          refresh(newVal);
        }
      });
      $scope.$watch('grid.userpage', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          refreshuser(newVal);
        }
      });
      //获取所有用户列表
      user.query(function (data) {
        $scope.allUsers = data;

      }, function (err) {
        console.log('err', err);
      });
      ////筛选可授权用户
      var checkUsers = function (allusers, onlyUser) {

        var alluser = angular.copy(allusers);
        var canadd = []
        angular.forEach(alluser, function (auser, i) {
          angular.forEach(onlyUser, function (ouser, k) {
            if (auser.id === ouser.userId) {
              auser.canadd = true;
            }
          })
        })
        angular.forEach(alluser, function (auser, i) {
          if (!auser.canadd) {
            canadd.push(auser)
          }
        })
        //for (var i = 0; i < alluser.length; i++) {
        //  for (var z = 0; z < onlyUser.length; z++) {
        //
        //    if (alluser[i] && alluser[i].id === onlyUser[z].userId) {
        //      alluser.splice(i, 1);
        //    }
        //  }
        //}
        return canadd;
      };

      // 获取租户下用户列表
      var gettenantuser = function (id) {
        $scope.users = [];
        tenantuser.query({id: id}, function (users) {
          //console.log('user', users);
          $scope.users = users;
          $scope.grid.usertotal = $scope.users.length;
          $scope.grid.userpage = 1;
          refreshuser(1);
        });
      };

      var checkServe = function (allserve, onlyserve) {
        console.log(allserve,onlyserve);
        $scope.newServeArr = [];
        angular.forEach(allserve, function (item) {
          if (item.servesList.length > 0) {
            item.servesList = [];
          }
          angular.forEach(onlyserve, function (list) {
            //stringVar.tolocaleUpperCase( )

            //console.log(item.serviceTypeName, list.serviceTypeName);
            if (item.serviceTypeName.toUpperCase() === list.serviceTypeName.toUpperCase()) {
              list.isaddbsi=false;
              item.servesList.push(list);
            }
          });
        });
        angular.forEach($scope.servesArr, function (item) {
          if (item.servesList.length > 0) {
            $scope.newServeArr.push(item);
          }
        });

        console.log('$scope.newServeArr', $scope.newServeArr);
        //console.log('$scope.servesArr', $scope.servesList);
      };
      /// 获取租户下的服务

      var getTenantServe = function (node) {
        //if (!node) {
        //  $scope.bsis = [];
        //
          tenantbsi.query({id: node.id}, function (bsis) {
            $scope.bsis = bsis;
            $scope.grid.bsitotal = $scope.bsis.length;
            checkServe($scope.servesArr, $scope.bsis);
            refresh(1);
            //console.log('bsi', bsis);
          }, function (err) {

          })
        //}else {
        //alert(1)
        //$scope.bsis = node.bsis;
        //if ($scope.bsis) {
        //  $scope.grid.bsitotal = $scope.bsis.length;
        //  checkServe($scope.servesArr, $scope.bsis);
        //  refresh(1);
        //}

        //console.log('bsi', bsis);
        //}

      };
      // 得到所有服务类型
      var loadserve = function (id, node) {
        service.query(function (data) {
          $scope.servesArr = [];
          angular.forEach(data, function (item) {
            var thisobj = {serviceTypeName: item.servicename, servesList: []};
            $scope.servesArr.push(thisobj);

          });
          getTenantServe(node);
        });
      };


      /// 获取租户下子公司列表
      var gerTenantChild = function (id) {
        $scope.childrens = [];
        tenantchild.query({name: Cookie.get("username"), id: id}, function (childrens) {
          //console.log('child', childrens);
          $scope.childrens = childrens;
        });
      };
      $scope.grid = {
        userpage: 1,
        usersize: 10,
        usertotal: 0,
        bsipage: 1,
        bsisize: 10,
        bsitotal: 0,
        showCompany: true,//展示子公司列表
        showProject: false,//展示子项目列表
        showChildnode: false,//展示子项目列表
        showbsi: false,
        roleTitle: tree[0] ? tree[0].name : '',
        treeId: '',
        isaddbsi:false
      };

      function getUserInfo(id, node) {

        gettenantuser(id);
        //console.log(node);

        getTenantServe(node);
        gerTenantChild(id);

      }

      var roleDemoList =
        [
          'a10170cb-524a-11e7-9dbb-fa163ed7d0ae',
        'a1149421-524a-11e7-9dbb-fa163ed7d0ae',
        'a12a84d0-524a-11e7-9dbb-fa163ed7d0ae',
        'a13dd087-524a-11e7-9dbb-fa163ed7d0ae'
      ];
      $scope.roleDemoList = roleDemoList.slice(0, 1);
      ///访问信息
      $scope.checkInfo = function (id, name) {
        serveinfo.get({tenantId: id, serviceInstanceName: name}, function (res) {
          //console.log('res', res.spec.provisioning.backingservice_name.toLocaleLowerCase());
          if (res.status.phase !== 'Provisioning') {
            var isout = false;
            angular.forEach(out, function (item) {
              //console.log('item', item);
              if (item === res.spec.provisioning.backingservice_name.toLocaleLowerCase()) {
                isout = true
              }
            })
            console.log('isout', isout);
            if (!isout) {

              newconfirm.open(res.spec.provisioning.credentials, res.status.phase);
            } else {
              if (res.spec.binding) {
                if ($scope.isroleId && res.spec.binding.length > 0) {
                  if ($scope.isroleId === 'a13dd087-524a-11e7-9dbb-fa163ed7d0ae' || $scope.isroleId === 'a12a84d0-524a-11e7-9dbb-fa163ed7d0ae') {
                    angular.forEach(res.spec.binding, function (item, i) {
                      console.log(item.bind_hadoop_user);
                      if (item.bind_hadoop_user === Cookie.get("username")) {
                        newconfirm.open(res.spec.binding[i].credentials, res.status.phase);
                      }

                    })
                  } else if ($scope.isroleId === 'a1149421-524a-11e7-9dbb-fa163ed7d0ae' || $scope.isroleId === 'a10170cb-524a-11e7-9dbb-fa163ed7d0ae') {
                    newconfirm.open(res.spec.binding[0].credentials, res.status.phase);
                  }


                }

              } else {
                Alert.open('没有绑定！');
              }

            }

          } else {
            Alert.open('正在创建！');
          }

        });

      };
      var ischengyuan = function (id, level) {
        userole.get({id: id, name: Cookie.get('username')}, function (data) {
          if (data.roleId && data.roleId !== 'a13dd087-524a-11e7-9dbb-fa163ed7d0ae') {
            $scope.ismember = false;
          } else {
            $scope.ismember = true;
          }

          if (data.roleId) {
            $scope.isroleId = data.roleId
            $scope.isrold = true;
          } else {
            $scope.isrold = false;
          }
          //console.log('data.roleId', data.roleId);
          //if (data.roleId) {
          //  $scope.userroleid =data.roleId
          //}
          //if (level === 1) {
          //
          //}a1149421-524a-11e7-9dbb-fa163ed7d0ae
          //data.roleId !== 'a13dd087-524a-11e7-9dbb-fa163ed7d0ae'
          //if (data.roleId) {
          //  if (level === 2) {
          //    if (data.roleId === 'a1149421-524a-11e7-9dbb-fa163ed7d0ae') {
          //      $scope.ismember = true;
          //    }
          //  } else if (level === 3) {
          //    if (data.roleId !== 'a13dd087-524a-11e7-9dbb-fa163ed7d0ae') {
          //      $scope.ismember = false;
          //    }
          //  }
          //
          //} else {
          //  $scope.ismember = true;
          //}
          //console.log(data);
        });
      };
      //用户授权
      $scope.userAuthorize = function () {
        //console.log('$scope.roleDemoList1111', $scope.roleDemoList);
        var thisuser = checkUsers($scope.allUsers, $scope.users);
        //console.log('thisuser', thisuser);
        if (thisuser[0]) {
          Confirm.open(thisuser, $scope.roleDemoList, {
            oldUser: thisuser[0].username,
            oldRole: $scope.roleDemoList[0],
            oldUserId: thisuser[0].id,
            description: '',
            isAdd: true,
            nodeId: $scope.nodeId
          }).then(
            function (res) {
              ischengyuan($scope.nodeId);
              gettenantuser($scope.nodeId)
            }
          );
        } else {
          Alert.open('所有用户已授权！');
        }

      };
      //修改用户授权
      $scope.updataUser = function (item) {
        Confirm.open($scope.users, $scope.roleDemoList, {
          oldUser: item.userName,
          oldRole: item.roleId,
          oldUserId: item.userId,
          description: item.userDescription,
          isAdd: false,
          nodeId: $scope.nodeId
        }).then(
          function (res) {
            //console.log('res', res);
            ischengyuan($scope.nodeId);
            angular.forEach($scope.users, function (item) {
              if (item.userId === res.userId) {
                item.roleId = res.roleId;
              }
            });
          }
        );
      };
      //右侧tabel切换
      $(function () {
        $('.right-nav>li').click(function () {
          //console.log($(this).index())
          var idx = $(this).index();
          $('.right-nav>li').eq(idx).addClass('active').siblings().removeClass('active');
          $('.right-content>li').eq(idx).show().siblings().hide();
        });
      });
      // 删除用户
      $scope.delUser = function (userId, username) {
        delconfirm.open('用户', $scope.nodeId, userId, username).then(function (res) {
            angular.forEach($scope.users, function (item, i) {
              if (item.userId === res.message) {
                $scope.users.splice(i, 1);
              }
            });
            console.log('$scope.grid.usertotaldel', $scope.grid.usertotal);
            $scope.grid.usertotal = $scope.users.length;
            $scope.grid.userpage = 1;
            refreshuser(1);
          }
        );
      };
      var chartsFun = function (sdata, pIdx, idx) {
        var used = parseInt(sdata.used);
        var size = parseInt(sdata.size);
        var num = parseInt(used / size * 100);
        var chartsobj = {
          options: {
            title: {
              text: ''
            },
            tooltip: {
              enabled: false
            },
            credits: {
              enabled: false
            },
            subtitle: {
              text: '<span style="color:#ff304a; font-size:16px;">' + num + '%</span>',
              style: {
                lineHeight: '20px'
              },
              align: 'center',
              verticalAlign: 'middle',
              x: 0,
              y: 5

            }
          },
          series: [{
            type: 'pie',
            colors: ['#ff304a', '#c6c6c6'],
            data: [
              ['已用', used],
              ['未使用', size - used]
            ],
            dataLabels: {
              enabled: false
            },
            innerSize: '80%'
          }],
          size: {
            height: 150,
            width: 150
          }


        };
        $scope.newServeArr[pIdx].servesList[idx].charsArr.push({'chartsobj': chartsobj, 'name': sdata.name});
      };
      $scope.toggleServeList = function (pIdx, idx, serveObj) {
        //console.log('$scope.newServeArr', $scope.newServeArr);
        if ($scope.newServeArr[pIdx].servesList[idx].isshow) {
          $scope.newServeArr[pIdx].servesList[idx].isshow = false;
        } else {
          bsidata.get({id: serveObj.tenantId, name: serveObj.instanceName}, function (sdata) {
            //bsidata.get({id: 'san', name: 'n4j'}, function (sdata) {

            $scope.newServeArr[pIdx].servesList[idx].charsArr = [];

            $scope.newServeArr[pIdx].servesList[idx].showused = sdata.items;

            //console.log('sdata', sdata);
            for (var i = 0; i < sdata.items.length; i++) {
              chartsFun(sdata.items[i], pIdx, idx);
            }
          }, function (err) {
            //console.log('sbsierr', err);
          });


          $scope.newServeArr[pIdx].servesList[idx].isshow = true;
        }
      };
      $scope.toggleServe = function (idx) {
        if ($scope.newServeArr[idx].isshow) {
          $scope.newServeArr[idx].isshow = false;
        } else {
          $scope.newServeArr[idx].isshow = true;
        }
      };
      //左侧导航切换
      function classify(bsis) {
        //$scope.bsis=bsis;
        getTenantServe($scope.nodeIf)
        if (bsis.length > 0) {
          $scope.svArr = []
          var servicenames = [];
          angular.forEach(bsis, function (bsi, i) {
            servicenames.push(bsi.serviceTypeName);
            bsi.isshow = false
          })
          servicenames = servicenames.unique()

          angular.forEach(servicenames, function (servicename, k) {
            $scope.svArr.push({
              serviceTypeName: servicename,
              isshow: false,
              servesList: []
            })
          })
          angular.forEach(bsis, function (bsi, i) {
            angular.forEach($scope.svArr, function (serve, k) {
              if (serve.serviceTypeName === bsi.serviceTypeName) {
                serve.servesList.push(bsi);
              }
            })
          })
          angular.forEach($scope.svArr, function (items, i) {

            angular.forEach(items.servesList, function (item, k) {
              item.ziyuan = []
              if (item.quota) {
                var obj = JSON.parse(item.quota)
                angular.forEach(obj, function (quota, j) {
                  console.log(quota, j);
                  if (j !== "instance_id") {
                    item.ziyuan.push({key: j, value: quota})
                  }


                })
              }

            })
          })
          //var obj = JSON.parse(str)
          //console.log('$scope.svArr', $scope.svArr);
        } else {
          $scope.svArr = []
          return
        }

        // $scope.mybsis=$scope.svArr
      }
      //添加实例
      $scope.addser = function (name,item) {
        console.log(item.isaddbsi);
        item.isaddbsi=true;
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
              //var timestamp = Date.parse(new Date());
              //timestamp = timestamp / 1000;
              //var newid = id;
              var username = Cookie.get("username")
              var bsiobj = {
                "kind": "BackingServiceInstance",
                "apiVersion": "v1",
                "metadata": {
                  "name": bs.metadata.name + '-' + username + '-' + uuid.num(7, 16),
                },
                "spec": {
                  "provisioning": {
                    "backingservice_name": bs.metadata.name,
                    "backingservice_plan_guid": bs.spec.plans[0].id,
                    "parameters": obj
                  }
                }
              }

              creatbsi.post({id: $scope.nodeId}, bsiobj, function (data) {
                //console.log('data', data);
                tenantbsi.query({id: $scope.nodeId}, function (bsis) {
                  var bsitems = []
                  angular.forEach(bsis, function (bsi, i) {
                    if (bsi.status == "Failure") {

                    } else {
                      bsitems.push(bsi)
                    }
                  })
                  bsis = angular.copy(bsitems)
                  classify(bsis)
                })
              })
            }
          })
        })
      }
      //删除bsi
      $scope.delbsied = function (name) {
        deletebsi.delete({id: $scope.nodeId, name: name}, function (datq) {
          tenantbsi.query({id: $scope.nodeId}, function (bsis) {
            var bsitems = []
            angular.forEach(bsis, function (bsi, i) {
              if (bsi.status == "Failure") {
              } else {
                bsitems.push(bsi)
              }
            })
            bsis = angular.copy(bsitems)
            console.log('delete', bsis);

            classify(bsis)
          })
        })
      }
      //选中一个节点
      $scope.showSelected = function (node) {
        ischengyuan(node.id);
        //console.log('node', node);
        //console.log(node.level, $scope.userroleid);
        Cookie.set('tenantId', node.id, 24 * 3600 * 1000);
        $scope.grid.roleTitle = node.name;
        $scope.nodeIf = node;
        $scope.nodeId = node.id;
        $scope.newServeArr = [];
        $scope.svArr = []
        getUserInfo(node.id, node);
        tenantbsi.query({id: node.id}, function (bsis) {
          //console.log('bsis', bsis);

          //$scope.bsis = bsis;
          //$scope.grid.bsitotal = $scope.bsis.length;
          //checkServe($scope.servesArr, $scope.bsis);
          //refresh(1);

          var bsitems = []
          angular.forEach(bsis, function (bsi, i) {
            if (bsi.status == "Failure") {

            } else {
              bsitems.push(bsi)
            }
          })
          bsis = angular.copy(bsitems)

          //console.log('servicenames', servicenames);
          if (bsis.length > 0) {

            // $scope.mybsis =[];
            //bsis = [
            //  {
            //    "id": "e45783a5-5240-11e7-8905-fa163efdbea8",
            //    "instanceName": "ETCD-instance017",
            //    "quota": {hiveStorageQuota:1024,yarnQueueQuota:10},
            //    "serviceTypeId": "",
            //    "serviceTypeName": "ETCD",
            //    "tenantId": "zhaoyim"
            //  }, {
            //    "id": "e45783a5-5240-11e7-8905-fa163efdbea8",
            //    "instanceName": "ETCD-instance017",
            //    "quota": {hiveStorageQuota:1024,yarnQueueQuota:10},
            //    "serviceTypeId": "",
            //    "serviceTypeName": "HDFS",
            //    "tenantId": "zhaoyim"
            //  }, {
            //    "id": "e45783a5-5240-11e7-8905-fa163efdbea8",
            //    "instanceName": "ETCD-instance017",
            //    "quota": {hiveStorageQuota:1024,yarnQueueQuota:10},
            //    "serviceTypeId": "",
            //    "serviceTypeName": "HBase",
            //    "tenantId": "zhaoyim"
            //  }, {
            //    "id": "e45783a5-5240-11e7-8905-fa163efdbea8",
            //    "instanceName": "ETCD-instance017",
            //    "quota": {hiveStorageQuota:1024,yarnQueueQuota:10},
            //    "serviceTypeId": "",
            //    "serviceTypeName": "MapReduce",
            //    "tenantId": "zhaoyim"
            //  }, {
            //    "id": "e45783a5-5240-11e7-8905-fa163efdbea8",
            //    "instanceName": "ETCD-instance017",
            //    "quota": {hiveStorageQuota:1024,yarnQueueQuota:10},
            //    "serviceTypeId": "",
            //    "serviceTypeName": "Spark",
            //    "tenantId": "zhaoyim"
            //  }, {
            //    "id": "e45783a5-5240-11e7-8905-fa163efdbea8",
            //    "instanceName": "ETCD-instance017",
            //    "quota": {hiveStorageQuota:1024,yarnQueueQuota:10},
            //    "serviceTypeId": "",
            //    "serviceTypeName": "Kafka",
            //    "tenantId": "zhaoyim"
            //  }, {
            //    "id": "e45783a5-5240-11e7-8905-fa163efdbea8",
            //    "instanceName": "ETCD-instance017",
            //    "quota": {hiveStorageQuota:1024,yarnQueueQuota:10},
            //    "serviceTypeId": "",
            //    "serviceTypeName": "Spark",
            //    "tenantId": "zhaoyim"
            //  }, {
            //    "id": "e45783a5-5240-11e7-8905-fa163efdbea8",
            //    "instanceName": "ETCD-instance017",
            //    "quota": {hiveStorageQuota:1024,yarnQueueQuota:10},
            //    "serviceTypeId": "",
            //    "serviceTypeName": "ETCD",
            //    "tenantId": "zhaoyim"
            //  }, {
            //    "id": "e45783a5-5240-11e7-8905-fa163efdbea8",
            //    "instanceName": "ETCD-instance017",
            //    "quota": {hiveStorageQuota:1024,yarnQueueQuota:10},
            //    "serviceTypeId": "",
            //    "serviceTypeName": "ETCD",
            //    "tenantId": "zhaoyim"
            //  },
            //]
            classify(bsitems)
            $scope.roleDemoList = roleDemoList.slice(2);
            //console.log('bbbbb');
            $scope.grid.showCompany = false;
            $scope.grid.showProject = false;
            $scope.grid.showChildnode = true;

            $('.right-nav>li').eq(2).addClass('active').siblings().removeClass('active');
            $('.right-content>li').eq(2).show().siblings().hide();
          } else {
            service.query(function (data) {
              angular.forEach(data, function (item) {

                var thisobj = {serviceTypeName: item.servicename, servesList: []};
                $scope.servesArr.push(thisobj);

              });
              console.log($scope.servesArr);
              checkServe($scope.servesArr, node.bsis);
            })

            if (node.parentId) {//lev2
              $scope.grid.showCompany = false;
              $scope.grid.showProject = true;
              $scope.grid.showChildnode = false;
              $('.right-nav>li').eq(1).addClass('active').siblings().removeClass('active');
              $('.right-content>li').eq(1).show().siblings().hide();
              $scope.roleDemoList = roleDemoList.slice(2);
            } else if (!node.parentId) {//lev1
              $scope.grid.treeId = 2;
              $scope.roleDemoList = roleDemoList.slice(0, 1);
              $scope.grid.showCompany = true;
              $scope.grid.showProject = false;
              $scope.grid.showChildnode = false;
              $('.right-nav>li').eq(0).addClass('active').siblings().removeClass('active');
              $('.right-content>li').eq(0).show().siblings().hide();

            }
          }
        }, function (err) {

        })
        if (node.children.length > 0) {
          $scope.grid.showbsi = false;
        } else {
          $scope.grid.showbsi = true;
        }


      };
      //创建树状结构
      function creattree(trees) {
        $scope.dataForTheTree = [];
        $scope.treemap = {};
        angular.forEach(trees, function (item) {
          $scope.treemap[item.id] = item;
          $scope.treemap[item.id].children = [];
        });


        angular.forEach(trees, function (item) {
          if (item.parentId) {
            //console.log('$scope.treemap[item.parentId]', $scope.treemap[item.parentId]);
            if ($scope.treemap[item.parentId]) {
              $scope.treemap[item.parentId].children.push(item);
            } else {
              delete $scope.treemap[item.id].parentId;
              $scope.dataForTheTree.push($scope.treemap[item.id]);
            }
          } else {
            $scope.dataForTheTree.push($scope.treemap[item.id]);
          }
        });
        var cinf = function (father) {
          angular.forEach(father.children, function (child) {
            cinf(child);
            angular.forEach(child.bsis, function (bsi) {
              father.bsis.push(bsi);
            });
          });

        };

        angular.forEach($scope.dataForTheTree, function (tree) {
          cinf(tree);
        });
        $scope.selected = $scope.dataForTheTree[0];
        ///页面初次加载;
        var fristLoad = function (id, node) {
          Cookie.set('tenantId', id, 24 * 3600 * 1000);
          $scope.showSelected(node);
          gettenantuser(id);
          loadserve(id, node);
          gerTenantChild(id);
        };
        if ($scope.dataForTheTree[0] && $scope.dataForTheTree[0].id) {
          fristLoad($scope.dataForTheTree[0].id, $scope.dataForTheTree[0]);
        }
      }
      creattree(tree)
      //添加租户
      $scope.addTenant = function () {
        console.log('$scope.nodeId', $scope.nodeId);
        addTenant.open($scope.nodeId).then(function (tenant) {
          console.log('tenant', $scope.nodeIf);

          gettree();
        });
      }
      //资源管理bsi展开
      $scope.bsiToggle = function (idx) {
        if ($scope.svArr[idx].isshow) {
          $scope.svArr[idx].isshow = false;
        } else {
          $scope.svArr[idx].isshow = true;
        }
      };
      $scope.svToggle = function (pIdx, idx, serveObj) {
        //console.log('$scope.newServeArr', $scope.newServeArr);
        if ($scope.svArr[pIdx].servesList[idx].isshow) {
          $scope.svArr[pIdx].servesList[idx].isshow = false;
        } else {
          //bsidata.get({id: serveObj.tenantId, name: serveObj.instanceName}, function (sdata) {
          //  //bsidata.get({id: 'san', name: 'n4j'}, function (sdata) {
          //
          //  $scope.svArr[pIdx].servesList[idx].charsArr = [];
          //
          //  $scope.svArr[pIdx].servesList[idx].showused = sdata.items;
          //
          //  //console.log('sdata', sdata);
          //  for (var i = 0; i < sdata.items.length; i++) {
          //    chartsFun(sdata.items[i], pIdx, idx);
          //  }
          //}, function (err) {
          //  //console.log('sbsierr', err);
          //});


          $scope.svArr[pIdx].servesList[idx].isshow = true;
        }
      };

      //添加服务
      $scope.addServe = function () {
        getdfbs.get(function (data) {
          //console.log('data', data);
          addserve_Confirm.open(data.items, $scope.nodeId).then(function () {
            //$scope.showSelected($scope.nodeIf)
            tenantbsi.query({id: $scope.nodeId}, function (bsis) {
              var bsitems = []
              angular.forEach(bsis, function (bsi, i) {
                if (bsi.status == "Failure") {

                } else {
                  bsitems.push(bsi)
                }
              })
              bsis = angular.copy(bsitems)
              classify(bsis)
            })
            //console.log('bsis', bsis);

            //$scope.bsis = bsis;
            //$scope.grid.bsitotal = $scope.bsis.length;
            //checkServe($scope.servesArr, $scope.bsis);
            //refresh(1);


          });
        });

      };
      //修改bsi
      $scope.editSv = function (pidx, idx) {
        $scope.svArr[pidx].servesList[idx]['isde'] = true;
        //console.log($scope.svArr);
      };
      //保存bsi
      $scope.saveSv = function (pidx, idx, bsi) {
        console.log('bsis', bsi.ziyuan);
        // $scope.svArr[pidx].servesList[idx]
        var putobj = {
          parameters: {}
        };
        angular.forEach(bsi.ziyuan, function (item, i) {
          putobj.parameters[item.key] = item.value
        })
        //putobj.parameters=bsi.quota
        updateinstance.put({id: $scope.nodeId, instanceName: bsi.instanceName}, putobj, function (data) {
          //$scope.showSelected($scope.nodeIf)
          tenantbsi.query({id: $scope.nodeId}, function (bsis) {
            var bsitems = []
            angular.forEach(bsis, function (bsi, i) {
              if (bsi.status == "Failure") {

              } else {
                bsitems.push(bsi)
              }
            })
            bsis = angular.copy(bsitems)
            classify(bsis)
          })

        })
        $scope.svArr[pidx].servesList[idx]['isde'] = false;
      };
    }]);
