export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/',
    name: 'Layout',
    redirect: '/home',
    component: () => import('@/views/layout/layout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/home'),
        meta: {
          title: '首页',
          activePath: '/home'
        }
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test/test.vue'),
        meta: {
          title: 'test',
          activePath: '/test'
        }
      },
      {
        path: '/areaManagement',
        name: 'areaManagement',
        component: () => import('@/views/basicInfoManagement/areaManagement'),
        meta: {
          title: '地区管理',
          activePath: '/areaManagement'
        }
      },
      {
        path: '/areaManagement/add',
        name: 'areaManagement/add',
        component: () => import('@/views/basicInfoManagement/areaManagement/add'),
        meta: {
          title: '地区管理-添加',
          activePath: '/areaManagement'
        }
      },
      {
        path: '/areaManagement/edit',
        name: 'areaManagement/edit',
        component: () => import('@/views/basicInfoManagement/areaManagement/add'),
        meta: {
          title: '地区管理-编辑',
          activePath: '/areaManagement'
        }
      },
      {
        path: '/orderType',
        name: 'orderType',
        component: () => import('@/views/basicInfoManagement/orderType'),
        meta: {
          title: '运单类型管理',
          activePath: '/orderType'
        }
      },
      {
        path: '/goodsCarType',
        name: 'goodsCarType',
        component: () => import('@/views/basicInfoManagement/goodsCarType'),
        meta: {
          title: '商品车类型管理',
          activePath: '/goodsCarType'
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
          title: '商品车-品牌管理',
          activePath: '/goodsCar'
        }
      },
      {
        path: '/goodsCar/vehicleCode',
        name: 'goodsCar/vehicleCode',
        component: () => import('@/views/basicInfoManagement/goodsCar/vehicleCode/vehicleCode'),
        meta: {
          title: '商品车-车型代码',
          activePath: '/goodsCar'
        }
      }
    ]
  }
]
