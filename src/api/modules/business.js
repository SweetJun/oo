// 业务模块api

const api = process.env.VUE_APP_API

export default {
  order: api + '/order', // 创建运单
  orders: api + '/orders', // 运单列表
  orderReply: api + '/order/reply', // 运单回单

  dispatches: api + '/dispatches', // 获取调度单列表
  dispatch: api + '/dispatch', // 详情，编辑、创建、删除调度单
  getDistance: api + '/distance', // 根据出发地、目的地、行驶类型获取里程
  truckPersonalSearchByKeyword: api + '/truck_personal/search/by/keyword', // 根据驾驶员姓名手机号车牌获取运力信息
  truckContractSearchByKeyword: api + '/truck_contract/search/by/keyword', // 根据驾驶员姓名手机号车牌获取运力信息
  truckOwnSearchByKeyword: api + '/truck_own/search/by/keyword', // 根据驾驶员姓名手机号车牌获取运力信息
  orderVehiclesToTransport: api + '/order_vehicles/to/transport', // 获取可发运的商品车
  dispatchRecommendRoute: api + '/dispatch/recommend/route', // 为指定商品车推荐路线
  expenseRuleMatchingTotalPrice: api + '/expense_rule/matching/total/price' // 计费策略匹配总价
}
