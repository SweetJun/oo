// 资源管理模块 路由

const ziyuanRouter = [{
  path: '/settlementaccount',
  name: 'settlementaccount',
  component: () => import('@/views/ziyuan/settlementAccount'),
  meta: {
    title: '结算人管理',
    activePath: '/settlementaccount'
  }
},
{
  path: '/settlementaccount/add',
  name: 'settlementaccount/add',
  component: () => import('@/views/ziyuan/settlementAccount/add'),
  meta: {
    title: '结算人管理-添加',
    activePath: '/settlementaccount'
  }
},
{
  path: '/settlementaccount/edit',
  name: 'settlementaccount/edit',
  component: () => import('@/views/ziyuan/settlementAccount/add'),
  meta: {
    title: '结算人管理-编辑',
    activePath: '/settlementaccount'
  }
},
{
  path: '/oilCard',
  name: 'oilCard',
  component: () => import('@/views/ziyuan/oilCard'),
  meta: {
    title: '加油卡管理',
    activePath: '/oilCard'
  }
},
{
  path: '/oilCard/add',
  name: 'oilCard/add',
  component: () => import('@/views/ziyuan/oilCard/add'),
  meta: {
    title: '加油卡-添加',
    activePath: '/oilCard'
  }
},
{
  path: '/oilCard/edit',
  name: 'oilCard/edit',
  component: () => import('@/views/ziyuan/oilCard/add'),
  meta: {
    title: '加油卡-编辑',
    activePath: '/oilCard'
  }
},
{
  path: '/driver/ownDriver',
  name: 'driver/ownDriver',
  component: () => import('@/views/ziyuan/driver/ownDriver'),
  meta: {
    title: '自有驾驶员',
    activePath: '/driver/ownDriver'
  }
},
{
  path: '/driver/ownDriver/add',
  name: 'driver/ownDriver/add',
  component: () => import('@/views/ziyuan/driver/ownDriver/add'),
  meta: {
    title: '驾驶员-添加',
    activePath: '/driver/ownDriver'
  }
},
{
  path: '/driver/ownDriver/edit',
  name: 'driver/ownDriver/edit',
  component: () => import('@/views/ziyuan/driver/ownDriver/add'),
  meta: {
    title: '驾驶员-编辑',
    activePath: '/driver/ownDriver'
  }
},
{
  path: '/driver/driverGrouping',
  name: 'driver/driverGrouping',
  component: () => import('@/views/ziyuan/driver/driverGrouping'),
  meta: {
    title: '驾驶员分组',
    activePath: '/driver/driverGrouping'
  }
},
{
  path: '/driver/driverGrouping/add',
  name: 'driver/driverGrouping/add',
  component: () => import('@/views/ziyuan/driver/driverGrouping/add'),
  meta: {
    title: '驾驶员分组-添加',
    activePath: '/driver/driverGrouping'
  }
},
{
  path: '/driver/driverGrouping/edit',
  name: 'driver/driverGrouping/edit',
  component: () => import('@/views/ziyuan/driver/driverGrouping/add'),
  meta: {
    title: '驾驶员分组-编辑',
    activePath: '/driver/driverGrouping'
  }
},
{
  path: '/tractor',
  name: 'tractor',
  component: () => import('@/views/ziyuan/carManagement/tractor'),
  meta: {
    title: '车辆管理',
    activePath: '/tractor'
  }
},
{
  path: '/tractor/add',
  name: 'tractor/add',
  component: () => import('@/views/ziyuan/carManagement/tractor/add'),
  meta: {
    title: '车辆管理-添加',
    activePath: '/tractor'
  }
},
{
  path: '/tractor/edit',
  name: 'tractor/edit',
  component: () => import('@/views/ziyuan/carManagement/tractor/add'),
  meta: {
    title: '车辆管理-编辑',
    activePath: '/tractor'
  }
},
{
  path: '/trailer',
  name: 'trailer',
  component: () => import('@/views/ziyuan/carManagement/trailer'),
  meta: {
    title: '挂车管理',
    activePath: '/trailer'
  }
},
{
  path: '/trailer/add',
  name: 'trailer/add',
  component: () => import('@/views/ziyuan/carManagement/trailer/add'),
  meta: {
    title: '挂车管理-添加',
    activePath: '/trailer'
  }
},
{
  path: '/trailer/edit',
  name: 'trailer/edit',
  component: () => import('@/views/ziyuan/carManagement/trailer/add'),
  meta: {
    title: '挂车管理-编辑',
    activePath: '/trailer'
  }
},
{
  path: '/truck/ownTruck',
  name: 'truck/ownTruck',
  component: () => import('@/views/ziyuan/truck/ownTruck'),
  meta: {
    title: '自有运力',
    activePath: '/truck/ownTruck'
  }
},
{
  path: '/truck/ownTruck/add',
  name: 'truck/ownTruck/add',
  component: () => import('@/views/ziyuan/truck/ownTruck/add'),
  meta: {
    title: '自有运力-添加',
    activePath: '/truck/ownTruck'
  }
},
{
  path: '/truck/ownTruck/edit',
  name: 'truck/ownTruck/edit',
  component: () => import('@/views/ziyuan/truck/ownTruck/add'),
  meta: {
    title: '自有运力-编辑',
    activePath: '/truck/ownTruck'
  }
},
{
  path: '/truck/contractTruck',
  name: 'truck/contractTruck',
  component: () => import('@/views/ziyuan/truck/contractTruck'),
  meta: {
    title: '合同外协运力',
    activePath: '/truck/contractTruck'
  }
},
{
  path: '/truck/contractTruck/add',
  name: 'truck/contractTruck/add',
  component: () => import('@/views/ziyuan/truck/contractTruck/add'),
  meta: {
    title: '合同外协-添加',
    activePath: '/truck/contractTruck'
  }
},
{
  path: '/truck/contractTruck/edit',
  name: 'truck/contractTruck/edit',
  component: () => import('@/views/ziyuan/truck/contractTruck/add'),
  meta: {
    title: '合同外协-编辑',
    activePath: '/truck/contractTruck'
  }
},
{
  path: '/truck/personalTruck',
  name: 'truck/personalTruck',
  component: () => import('@/views/ziyuan/truck/personalTruck'),
  meta: {
    title: '个人外协运力',
    activePath: '/truck/personalTruck'
  }
},
{
  path: '/truck/personalTruck/add',
  name: 'truck/personalTruck/add',
  component: () => import('@/views/ziyuan/truck/personalTruck/add'),
  meta: {
    title: '个人外协-添加',
    activePath: '/truck/personalTruck'
  }
},
{
  path: '/truck/personalTruck/edit',
  name: 'truck/personalTruck/edit',
  component: () => import('@/views/ziyuan/truck/personalTruck/add'),
  meta: {
    title: '个人外协-编辑',
    activePath: '/truck/personalTruck'
  }
},
{
  path: '/truck/oilcost',
  name: 'truck/oilcost',
  component: () => import('@/views/ziyuan/truck/oilCost'),
  meta: {
    title: '运力油耗设置',
    activePath: '/truck/oilcost'
  }
},
{
  path: '/truck/truckgroup',
  name: 'truck/truckgroup',
  component: () => import('@/views/ziyuan/truck/truckGroup'),
  meta: {
    title: '运力分组设置',
    activePath: '/truck/truckgroup'
  }
},
{
  path: '/truck/truckgroup/add',
  name: 'truck/truckgroup/add',
  component: () => import('@/views/ziyuan/truck/truckGroup/add'),
  meta: {
    title: '运力分组-添加',
    activePath: '/truck/truckgroup'
  }
},
{
  path: '/truck/truckgroup/edit',
  name: 'truck/truckgroup/edit',
  component: () => import('@/views/ziyuan/truck/truckGroup/add'),
  meta: {
    title: '运力分组-编辑',
    activePath: '/truck/truckgroup'
  }
},
{
  path: '/client',
  name: 'client',
  component: () => import('@/views/ziyuan/client'),
  meta: {
    title: '客户管理',
    activePath: '/client'
  }
},
{
  path: '/client/add',
  name: 'client/add',
  component: () => import('@/views/ziyuan/client/add'),
  meta: {
    title: '客户管理-添加',
    activePath: '/client'
  }
},
{
  path: '/client/edit',
  name: 'client/edit',
  component: () => import('@/views/ziyuan/client/add'),
  meta: {
    title: '客户管理-编辑',
    activePath: '/client'
  }
},
{
  path: '/provider',
  name: 'provider',
  component: () => import('@/views/ziyuan/provider'),
  meta: {
    title: '承运方管理',
    activePath: '/provider'
  }
},
{
  path: '/provider/add',
  name: 'provider/add',
  component: () => import('@/views/ziyuan/provider/add'),
  meta: {
    title: '承运方-添加',
    activePath: '/provider'
  }
},
{
  path: '/provider/edit',
  name: 'provider/edit',
  component: () => import('@/views/ziyuan/provider/add'),
  meta: {
    title: '承运方-编辑',
    activePath: '/provider'
  }
},
{
  path: '/vehicleWarehouse',
  name: 'vehicleWarehouse',
  component: () => import('@/views/ziyuan/vehicleWarehouse'),
  meta: {
    title: '商品车仓库管理',
    activePath: '/vehicleWarehouse'
  }
}
]

export default ziyuanRouter
