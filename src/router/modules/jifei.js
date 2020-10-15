// 计费模块 路由

const jifeiRouter = [
  {
    path: '/oilPrice',
    name: 'oilPrice',
    component: () => import('@/views/jifei/oilPrice'),
    meta: {
      title: '公司油价管理',
      activePath: '/oilPrice'
    }
  },
  {
    path: '/oilPrice/add',
    name: 'oilPrice/add',
    component: () => import('@/views/jifei/oilPrice/add'),
    meta: {
      title: '公司油价-添加',
      activePath: '/oilPrice'
    }
  },
  {
    path: '/oilPrice/edit',
    name: 'oilPrice/edit',
    component: () => import('@/views/jifei/oilPrice/add'),
    meta: {
      title: '公司油价-编辑',
      activePath: '/oilPrice'
    }
  },
  {
    path: '/mileages',
    name: 'mileages',
    component: () => import('@/views/jifei/mileages'),
    meta: {
      title: '内部里程管理',
      activePath: '/mileages'
    }
  },
  {
    path: '/mileages/add',
    name: 'mileages/add',
    component: () => import('@/views/jifei/mileages/add'),
    meta: {
      title: '内部里程-添加',
      activePath: '/mileages'
    }
  },
  {
    path: '/mileages/edit',
    name: 'mileages/edit',
    component: () => import('@/views/jifei/mileages/add'),
    meta: {
      title: '内部里程-编辑',
      activePath: '/mileages'
    }
  },
  {
    path: '/clientrule',
    name: 'clientrule',
    component: () => import('@/views/jifei/clientRule'),
    meta: {
      title: '客户结算规则管理',
      activePath: '/clientrule'
    }
  },
  {
    path: '/clientrule/price',
    name: 'clientrule/price',
    component: () => import('@/views/jifei/clientRule/price'),
    meta: {
      title: '价格管理',
      activePath: '/clientrule'
    }
  },
  {
    path: '/clientrule/price/add',
    name: 'clientrule/price/add',
    component: () => import('@/views/jifei/clientRule/price/add'),
    meta: {
      title: '添加价格',
      activePath: '/clientrule'
    }
  },
  {
    path: '/clientrule/price/edit',
    name: 'clientrule/price/edit',
    component: () => import('@/views/jifei/clientRule/price/add'),
    meta: {
      title: '编辑价格',
      activePath: '/clientrule'
    }
  },
  {
    path: '/clientrule/missingprice',
    name: 'clientrule/missingprice',
    component: () => import('@/views/jifei/clientRule/missingPrice'),
    meta: {
      title: '缺失价格管理',
      activePath: '/clientrule'
    }
  },
  {
    path: '/providerule',
    name: 'providerule',
    component: () => import('@/views/jifei/providerRule'),
    meta: {
      title: '承运方结算规则管理',
      activePath: '/providerule'
    }
  },
  {
    path: '/providerule/price',
    name: 'providerule/price',
    component: () => import('@/views/jifei/providerRule/price'),
    meta: {
      title: '价格管理',
      activePath: '/providerule'
    }
  },
  {
    path: '/providerule/price/add',
    name: 'providerule/price/add',
    component: () => import('@/views/jifei/providerRule/price/add'),
    meta: {
      title: '添加价格',
      activePath: '/providerule'
    }
  },
  {
    path: '/providerule/price/edit',
    name: 'providerule/price/edit',
    component: () => import('@/views/jifei/providerRule/price/add'),
    meta: {
      title: '编辑价格',
      activePath: '/providerule'
    }
  },
  {
    path: '/providerule/missingprice',
    name: 'providerule/missingprice',
    component: () => import('@/views/jifei/providerRule/missingPrice'),
    meta: {
      title: '缺失价格管理',
      activePath: '/providerule'
    }
  },
  {
    path: '/expenserule',
    name: 'expenserule',
    component: () => import('@/views/jifei/expenseRule'),
    meta: {
      title: '计费策略管理',
      activePath: '/expenserule'
    }
  },
  {
    path: '/expenserule/add',
    name: 'expenserule/add',
    component: () => import('@/views/jifei/expenseRule/add'),
    meta: {
      title: '计费策略-添加',
      activePath: '/expenserule'
    }
  },
  {
    path: '/expenserule/edit',
    name: 'expenserule/edit',
    component: () => import('@/views/jifei/expenseRule/add'),
    meta: {
      title: '计费策略-编辑',
      activePath: '/expenserule'
    }
  }
]

export default jifeiRouter
