// 系统设置模块 路由

const systemSetting = [
  {
    path: '/transporttype',
    name: 'transporttype',
    component: () => import('@/views/systemSetting/transportType'),
    meta: {
      title: '承运类型管理',
      activePath: '/transporttype'
    }
  },
  {
    path: '/transporttype/add',
    name: 'transporttype/add',
    component: () => import('@/views/systemSetting/transportType/add'),
    meta: {
      title: '承运类型-添加',
      activePath: '/transporttype'
    }
  },
  {
    path: '/transporttype/edit',
    name: 'transporttype/edit',
    component: () => import('@/views/systemSetting/transportType/add'),
    meta: {
      title: '承运类型-设置',
      activePath: '/transporttype'
    }
  },
  {
    path: '/role',
    name: 'role',
    component: () => import('@/views/systemSetting/role'),
    meta: {
      title: '角色管理',
      activePath: '/role'
    }
  },
  {
    path: '/role/add',
    name: 'role/add',
    component: () => import('@/views/systemSetting/role/add'),
    meta: {
      title: '角色管理-添加',
      activePath: '/role'
    }
  },
  {
    path: '/role/edit',
    name: 'role/edit',
    component: () => import('@/views/systemSetting/role/add'),
    meta: {
      title: '角色管理-编辑',
      activePath: '/role'
    }
  },
  {
    path: '/usermanager',
    name: 'usermanager',
    component: () => import('@/views/systemSetting/userManager'),
    meta: {
      title: '账号管理',
      activePath: '/usermanager'
    }
  },
  {
    path: '/department',
    name: 'department',
    component: () => import('@/views/systemSetting/department'),
    meta: {
      title: '组织架构',
      activePath: '/department'
    }
  },
  {
    path: '/department/setting',
    name: 'department/setting',
    component: () => import('@/views/systemSetting/department/setting'),
    meta: {
      title: '部门设置',
      activePath: '/department'
    }
  },
  {
    path: '/systemsetup',
    name: 'systemsetup',
    component: () => import('@/views/systemSetting/systemSetup'),
    meta: {
      title: '系统设置',
      activePath: '/systemsetup'
    }
  },
  {
    path: '/authorise',
    name: 'authorise',
    component: () => import('@/views/systemSetting/thirdPartyAuthorise'),
    meta: {
      title: '第三方服务管理',
      activePath: '/authorise'
    }
  },
  {
    path: '/authorise/wjy',
    name: 'authorise/wjy',
    component: () => import('@/views/systemSetting/thirdPartyAuthorise/wjy'),
    meta: {
      title: '万金油授权管理',
      activePath: '/authorise'
    }
  }
]

export default systemSetting
