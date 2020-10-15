// 计费模块 路由

const reportRouter = [
  {
    path: '/clientIncome',
    name: 'clientIncome',
    component: () => import('@/views/report/reportDashboard/clientIncome'),
    meta: {
      title: '客户产值报表',
      activePath: '/clientIncome'
    }
  },
  {
    path: '/transportAmount',
    name: 'transportAmount',
    component: () => import('@/views/report/reportDashboard/transportAmount'),
    meta: {
      title: '发运量看板',
      activePath: '/transportAmount'
    }
  },
  {
    path: '/owntruck/costchart',
    name: 'owntruck/costchart',
    component: () => import('@/views/report/ownTruckCost'),
    meta: {
      title: '自有车成本报表',
      activePath: '/owntruck/costchart'
    }
  },
  {
    path: '/custom/chartmanagement',
    name: 'custom/chartmanagement',
    component: () => import('@/views/report/custom/chartManagement'),
    meta: {
      title: '配置报表',
      activePath: '/custom/chartmanagement'
    }
  },
  {
    path: '/custom/chartmanagement/add',
    name: 'custom/chartmanagement/add',
    component: () => import('@/views/report/custom/chartManagement/add'),
    meta: {
      title: '配置报表-添加',
      activePath: '/custom/chartmanagement'
    }
  },
  {
    path: '/custom/chartmanagement/edit',
    name: 'custom/chartmanagement/edit',
    component: () => import('@/views/report/custom/chartManagement/add'),
    meta: {
      title: '配置报表-编辑',
      activePath: '/custom/chartmanagement'
    }
  },
  {
    path: '/custom/chart',
    name: 'custom/chart',
    component: () => import('@/views/report/custom/chart'),
    meta: {
      title: '我的报表',
      activePath: '/custom/chart'
    }
  }
]

export default reportRouter
