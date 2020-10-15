// 业务管理模块 路由

const businessRouter = [
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/business/order'),
    meta: {
      title: '运单列表',
      activePath: '/order'
    }
  },
  {
    path: '/order/add',
    name: 'order/add',
    component: () => import('@/views/business/order/add'),
    meta: {
      title: '运单管理-添加',
      activePath: '/order'
    }
  },
  {
    path: '/order/edit',
    name: 'order/edit',
    component: () => import('@/views/business/order/add'),
    meta: {
      title: '运单管理-编辑',
      activePath: '/order'
    }
  },
  {
    path: '/order/expense',
    name: 'order/expense',
    component: () => import('@/views/business/order/expense'),
    meta: {
      title: '运单管理-添加费用',
      activePath: '/order'
    }
  },
  {
    path: '/dispatch',
    name: 'dispatch',
    component: () => import('@/views/business/dispatch'),
    meta: {
      title: '调度单列表',
      activePath: '/dispatch'
    }
  },
  {
    path: '/dispatch/add',
    name: 'dispatch/add',
    component: () => import('@/views/business/dispatch/add'),
    meta: {
      title: '添加调度单',
      activePath: '/dispatch'
    }
  },
  {
    path: '/dispatch/edit',
    name: 'dispatch/edit',
    component: () => import('@/views/business/dispatch/add'),
    meta: {
      title: '编辑调度单',
      activePath: '/dispatch'
    }
  },
  {
    path: '/dispatchToLoadVehicle',
    name: 'dispatchToLoadVehicle',
    component: () => import('@/views/business/dispatchToLoadVehicle'),
    meta: {
      title: '待装车列表',
      activePath: '/dispatchToLoadVehicle'
    }
  },
  {
    path: '/dispatchOnTheWay',
    name: 'dispatchOnTheWay',
    component: () => import('@/views/business/dispatchOnTheWay'),
    meta: {
      title: '在途列表',
      activePath: '/dispatchOnTheWay'
    }
  },
  {
    path: '/dispatchToDeliveryVehicle',
    name: 'dispatchToDeliveryVehicle',
    component: () => import('@/views/business/dispatchToDeliveryVehicle'),
    meta: {
      title: '待交货列表',
      activePath: '/dispatchToDeliveryVehicle'
    }
  },
  {
    path: '/orderToReply',
    name: 'orderToReply',
    component: () => import('@/views/business/orderToReply'),
    meta: {
      title: '待回单列表',
      activePath: '/orderToReply'
    }
  },
  {
    path: '/orderToReply/receipt',
    name: 'orderToReply/receipt',
    component: () => import('@/views/business/orderToReply/receipt'),
    meta: {
      title: '运单回单-回单',
      activePath: '/orderToReply'
    }
  }
]

export default businessRouter
