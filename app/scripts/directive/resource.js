'use strict';

angular.module('basic.resource', ['ngResource']).factory('role', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/role', {}, {});
}]).factory('allRole', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/role', {}, {});
}]).factory('service', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/service', {}, {
    create: {method: 'POST'}
  });
}]).factory('broker', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/service/broker', {}, {
    create: {method: 'POST'}
  });
}]).factory('user', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/user/:id', {id: '@id'}, {
    create: {method: 'POST'},
    updata: {method: 'PUT'},
    delete: {method: "DELETE"}
  });
}]).factory('newUser', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/user/with/tenants', {}, {});
}]).factory('putuser', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/user/name/:name', {
    name: '@name'
  }, {
    updata: {method: 'PUT'}
  });
}]).factory('tenant', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id', {id: '@id'}, {});
}]).factory('tenantname', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/user/name/:name/all/tenants', {name: '@name'}, {});
}]).factory('tenantchild', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/user/name/:name/tenant/:id/children/tenants', {
    name: '@name',
    id: '@id'
  }, {});
}]).factory('tenantuser', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id/users', {id: '@id'}, {});
}]).factory('deltenantuser', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id/user/:userId/role/assignment', {
    id: '@id',
    userId: "@userId"
  }, {
    delete: {method: "DELETE"}
  });
}]).factory('cGtenantuser', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id/user/role/assignment', {id: '@id'}, {
    post: {method: "POST"},
    put: {method: "put"}
  });
}]).factory('login', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/authc/login', {}, {
    post: {method: "POST"}
  });
}]).factory('tenantbsi', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id/service/instances', {id: '@id'}, {});
}]).factory('allbsi', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/service/all/instances', {id: '@id'}, {});
}]).factory('sso', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/sso/user', {}, {});
}]).factory('bsidata', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.bdxhost + '/namespaces/:id/instances/:name', {id: '@id', name: '@name'}, {});
}]).factory('userole', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id/user/:name/role', {
    id: '@id',
    name: '@name'
  }, {});
}]).factory('userinfo', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/user/name/:name/tenant/:id/assignments/info', {
    name: '@name',
    id: '@id'
  }, {});
}]).factory('deletebsi', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id/service/instance/:name', {
    name: '@name',
    id: '@id'
  }, {
    delete: {method: "DELETE"}
  });
}]).factory('getplan', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + 'service/:name/plan', {
    name: '@name'
  }, {});
}]).factory('getdfbs', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/service/df', {}, {});
}]).factory('creatbsi', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id/service/instance', {
    id: '@id'
  }, {
    post: {method: "POST"}
  });
}]).factory('addtenantapi', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant', {}, {
    post: {method: "POST"},
    updata: {method: "PUT"}
  });
}]).factory('updateinstance', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id/service/instance/:instanceName', {
    instanceName: '@instanceName',
    id: '@id'
  }, {
    put: {method: "PUT"}
  });
}]).factory('putusername', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/user/:name/password', {
    name: '@name'
  }, {
    put: {method: "PUT"}
  });
}]).factory('deletetenantapi', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:id', {
    id: '@id'
  }, {
    delete: {method: "DELETE"}
  });
}]).factory('authctype', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/authc/type', {}, {});
}]).factory('ladptype', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/user/ldap', {}, {});
}]).factory('createkeytab', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/kerberos/create/keytab', {}, {
    post: {method: "POST"}
  });
}]).factory('getkeytab', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/kerberos/keytab/:name', {
    name: '@name'
  }, {});
}]).factory('serveinfo', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
  return $resource(GLOBAL.host + '/tenant/:tenantId/service/instance/:serviceInstanceName/access/info', {
    tenantId: '@tenantId',
    serviceInstanceName: '@serviceInstanceName'
  }, {});
}]).factory('ocdpservices', ['$resource', 'GLOBAL', function ($resource, GLOBAL) {
     return $resource(GLOBAL.host + '/ocdp/services', {}, {});
}]);
