// 结算管理模块 路由

const settlementRouter = [
  {
    path: '/settlement/owndriver',
    name: 'settlement/owndriver',
    component: () => import('@/views/settlement/ownDriverSettlement'),
    meta: {
      title: '自有驾驶员结算',
      activePath: '/settlement/owndriver'
    }
  },
  {
    path: '/settlement/add',
    name: 'settlement/add',
    component: () => import('@/views/settlement/ownDriverSettlement/add'),
    meta: {
      title: '结算单'
    }
  },
  {
    path: '/settlement/edit',
    name: 'settlement/edit',
    component: () => import('@/views/settlement/ownDriverSettlement/add'),
    meta: {
      title: '结算单'
    }
  },
  {
    path: '/settlement/personaltruck',
    name: 'settlement/personaltruck',
    component: () => import('@/views/settlement/personalTruckSettlement'),
    meta: {
      title: '个人外协结算',
      activePath: '/settlement/personaltruck'
    }
  },
  {
    path: '/settlement/owingEntity',
    name: 'settlement/owingEntity',
    component: () => import('@/views/settlement/owingEntity/index'),
    meta: {
      title: '欠款管理',
      activePath: '/settlement/owingEntity'
    }
  },
  {
    path: '/settlement/owingEntity/detail',
    name: 'settlement/owingEntity/detail',
    component: () => import('@/views/settlement/owingEntity/owingDetail'),
    meta: {
      title: '欠款详情',
      activePath: '/settlement/owingEntity'
    }
  },
  {
    path: '/settlement/owingEntity/detailDetail',
    name: 'settlement/owingEntity/detailDetail',
    component: () => import('@/views/settlement/owingEntity/owingDetailDetail'),
    meta: {
      title: '欠款详情/详情',
      activePath: '/settlement/owingEntity'
    }
  },
  {
    path: '/settlement/carrierbill',
    name: 'settlement/carrierbill',
    component: () => import('@/views/settlement/carrierBill'),
    meta: {
      title: '承运方账单',
      activePath: '/settlement/carrierbill'
    }
  },
  {
    path: '/settlement/dispatchtoaddsettlementbill',
    name: 'settlement/dispatchtoaddsettlementbill',
    component: () => import('@/views/settlement/dispatchToAddSettlementBill'),
    meta: {
      title: '待结算调度单',
      activePath: '/settlement/dispatchtoaddsettlementbill'
    }
  }
]

export default settlementRouter
