// 基础数据管理 路由

const basicInfoRouter = [
  {
    path: '/areamanagement',
    name: 'areamanagement',
    component: () => import('@/views/basicInfoManagement/areaManagement'),
    meta: {
      title: '地区管理',
      activePath: '/areamanagement'
    }
  },
  {
    path: '/areamanagement/add',
    name: 'areamanagement/add',
    component: () => import('@/views/basicInfoManagement/areaManagement/add'),
    meta: {
      title: '地区管理-添加',
      activePath: '/areamanagement'
    }
  },
  {
    path: '/areamanagement/edit',
    name: 'areamanagement/edit',
    component: () => import('@/views/basicInfoManagement/areaManagement/add'),
    meta: {
      title: '地区管理-编辑',
      activePath: '/areamanagement'
    }
  },
  {
    path: '/goodsCar',
    name: 'goodsCar',
    component: () => import('@/views/basicInfoManagement/goodsCar'),
    meta: {
      title: '商品车管理',
      activePath: '/goodsCar'
    }
  },
  {
    path: '/goodsCar/add',
    name: 'goodsCar/add',
    component: () => import('@/views/basicInfoManagement/goodsCar/add'),
    meta: {
      title: '商品车-添加',
      activePath: '/goodsCar'
    }
  },
  {
    path: '/goodsCar/edit',
    name: 'goodsCar/edit',
    component: () => import('@/views/basicInfoManagement/goodsCar/add'),
    meta: {
      title: '商品车-编辑',
      activePath: '/goodsCar'
    }
  },
  {
    path: '/goodsCar/brand',
    name: 'goodsCar/brand',
    component: () => import('@/views/basicInfoManagement/goodsCar/brand/brand'),
    meta: {
      title: '商品车品牌管理',
      activePath: '/goodsCar/brand'
    }
  },
  {
    path: '/goodsCar/vehicleCode',
    name: 'goodsCar/vehicleCode',
    component: () => import('@/views/basicInfoManagement/goodsCar/vehicleCode/vehicleCode'),
    meta: {
      title: '车型代码代码',
      activePath: '/goodsCar/vehicleCode'
    }
  },
  {
    path: '/costTypeManagement',
    name: 'costTypeManagement',
    component: () => import('@/views/basicInfoManagement/costTypeManagement'),
    meta: {
      title: '费用类型管理',
      activePath: '/costTypeManagement'
    }
  },
  {
    path: '/costTypeManagement/add',
    name: 'costTypeManagement/add',
    component: () => import('@/views/basicInfoManagement/costTypeManagement/add'),
    meta: {
      title: '费用类型管理-添加',
      activePath: '/costTypeManagement'
    }
  },
  {
    path: '/costTypeManagement/edit',
    name: 'costTypeManagement/edit',
    component: () => import('@/views/basicInfoManagement/costTypeManagement/add'),
    meta: {
      title: '费用类型管理-编辑',
      activePath: '/costTypeManagement'
    }
  },
  {
    path: '/dealerManagement',
    name: 'dealerManagement',
    component: () => import('@/views/basicInfoManagement/dealerManagement'),
    meta: {
      title: '经销商管理',
      activePath: '/dealerManagement'
    }
  },
  {
    path: '/dealerManagement/add',
    name: 'dealerManagement/add',
    component: () => import('@/views/basicInfoManagement/dealerManagement/add'),
    meta: {
      title: '经销商管理-添加',
      activePath: '/dealerManagement'
    }
  },
  {
    path: '/dealerManagement/edit',
    name: 'dealerManagement/edit',
    component: () => import('@/views/basicInfoManagement/dealerManagement/add'),
    meta: {
      title: '经销商管理-编辑',
      activePath: '/dealerManagement'
    }
  }
]

export default basicInfoRouter
