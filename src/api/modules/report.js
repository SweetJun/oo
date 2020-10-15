// 报表模块api

const api = process.env.VUE_APP_API

export default {
  clientChart: api + '/income_chart/client', // 按客户统计
  agencyChart: api + '/income_chart/agency', // 按办事处统计
  revenueTypeChart: api + '/income_chart/revenue_type', // 按价格类型统计
  ownTruckDispatchCostChart: api + '/own_truck_dispatch_cost_chart', // 自有车成本报表
  customChartsManagement: api + '/custom_charts/management', // 获取自定义报表管理列表
  customChartsView: api + '/custom_charts/view', // 获取自定义报表查看列表
  customChartDataSource: api + '/search_item/option/custom_chart_data_source', // 获取数据源数据
  customChart: api + '/custom_chart', // 获取数据源数据
  customChartView: api + '/custom_chart/view' // 获取报表展示数据
}
