//
/**
 * @Description: 用于每个页面的导出 type
 * @Author: wjw
 * @Date: 2020-03-23 16:22:53
 * @param : key => 对应的每个页面route的 path属性
 * @param : value => 对应的每个页面导出的type值，由后台提供
 */
export default {
  '/areamanagement': 'region', // 地区
  '/goodsCar': 'vehicle', // 商品车
  '/goodsCar/brand': 'vehicle_brand', // 商品车品牌
  '/goodsCar/vehicleCode': 'vehicle_code', // 商品车代码
  '/costTypeManagement': 'expense', // 费用类型
  '/dealerManagement': 'dealer', // 经销商

  '/clientrule/price': 'client_rule', // 客户价格管理
  '/clientrule/missingprice': 'client_miss_rule', // 客户缺失价格管理
  '/providerule/price': 'provider_rule', // 承运方价格管理
  '/providerule/missingprice': 'provider_miss_rule', // 承运方缺失价格管理
  '/oilPrice': 'oil_line', // 油价
  '/mileages': 'mileage', // 内部里程

  '/settlementaccount': 'settlement_account', // 结算人管理
  '/oilCard': 'oil_card', // 油卡
  '/driver/ownDriver': 'driver', // 自由驾驶员
  '/tractor': 'tractor', // 牵引车
  '/trailer': 'trailer', // 挂车
  '/truck/ownTruck': 'own_truck', // 自有运力
  '/truck/contractTruck': 'contract_truck', // 合同外协
  '/truck/personalTruck': 'personal_truck', // 个人外协
  '/truck/oilcost': 'truck_oil_cost', // 油耗
  '/client': 'client', // 客户
  '/provider': 'provider', // 承运方
  '/vehicleWarehouse': 'vehicle_warehouse', // 商品车仓库管理

  '/order': 'order', // 运单
  '/dispatch': 'dispatch', // 调度单列表
  '/dispatchToLoadVehicle': 'dispatch_to_load_vehicle', // 待装车列表
  '/dispatchOnTheWay': 'dispatch_on_the_way', // 在途列表
  '/dispatchToDeliveryVehicle': 'dispatch_to_delivery_vehicle', // 待交货列表
  '/orderToReply': 'order_to_reply', // 待回单列表

  '/borrowing': 'dispatch_borrowing', // 借支单列表
  '/supplement': 'dispatch_supplement', // 补款单列表
  '/bankremittance': 'bankcard_pay_record', // 银行卡打款列表
  '/oilremittance': 'oil_card_pay_record', // 油卡打款列表
  '/wjyremittance': 'wjy_pay_record', // 万金油打款列表
  '/defaultremittance': 'default_pay_record', // 其他打款列表

  '/settlement/owndriver': 'dispatch_own_settlement', // 自有驾驶员结算
  '/settlement/personaltruck': 'dispatch_personal_settlement', // 个人外协结算

  '/owntruck/costchart': 'own_truck_dispatch_cost_chart', // 自有车成本报表
  '/custom/chart': 'custom_chart', // 自有车成本报表




  'example': ''
}
