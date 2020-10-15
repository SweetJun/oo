// 财务管理模块 路由

const financeRouter = [
  {
    path: '/borrowing',
    name: 'borrowing',
    component: () => import('@/views/finance/borrowing'),
    meta: {
      title: '借支单列表',
      activePath: '/borrowing'
    }
  },
  {
    path: '/borrowing/add',
    name: 'borrowing/add',
    component: () => import('@/views/finance/borrowing/add'),
    meta: {
      title: '借支单-新建',
      activePath: '/borrowing',
      tabTitle: '借支单列表'
    }
  },
  {
    path: '/borrowing/edit',
    name: 'borrowing/edit',
    component: () => import('@/views/finance/borrowing/add'),
    meta: {
      title: '借支单-编辑',
      activePath: '/borrowing'
    }
  },
  {
    path: '/supplement',
    name: 'supplement',
    component: () => import('@/views/finance/supplement'),
    meta: {
      title: '补款单列表',
      activePath: '/supplement'
    }
  },
  {
    path: '/supplement/add',
    name: 'supplement/add',
    component: () => import('@/views/finance/supplement/add'),
    meta: {
      title: '补款单-新建',
      activePath: '/supplement',
      tabTitle: '补款单列表'
    }
  },
  {
    path: '/supplement/edit',
    name: 'supplement/edit',
    component: () => import('@/views/finance/supplement/add'),
    meta: {
      title: '补款单-编辑',
      activePath: '/supplement'
    }
  },
  {
    path: '/bankremittance',
    name: 'bankremittance',
    component: () => import('@/views/finance/bankRemittance'),
    meta: {
      title: '银行卡打款列表',
      activePath: '/bankremittance'
    }
  },
  {
    path: '/oilremittance',
    name: 'oilremittance',
    component: () => import('@/views/finance/oilRemittance'),
    meta: {
      title: '油卡打款列表',
      activePath: '/oilremittance'
    }
  },
  {
    path: '/wjyremittance',
    name: 'wjyremittance',
    component: () => import('@/views/finance/wjyremittance'),
    meta: {
      title: '万金油打款列表',
      activePath: '/wjyremittance'
    }
  },
  {
    path: '/defaultremittance',
    name: 'defaultremittance',
    component: () => import('@/views/finance/defaultRemittance'),
    meta: {
      title: '其他打款列表',
      activePath: '/defaultremittance'
    }
  }
]

export default financeRouter
