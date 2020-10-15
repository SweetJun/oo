/**
 * @Description: 用于每个页面的权限 type
 * @Author: wjw
 * @Date: 2020-03-23 16:22:53
 * @param : key => 对应的每个页面route的 path 属性
 * @param : value => 对应的每个页面权限的type值，由后台提供
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
  '/providerule': 'provider_rule_set', // 承运方规则汇总表
  '/providerule/price': 'provider_rule', // 承运方价格管理
  '/providerule/missingprice': 'provider_miss_rule', // 承运方缺失价格管理
  '/expenserule': 'expense_rule', // 计费策略管理
  '/oilPrice': 'oil_line', // 油价
  '/mileages': 'mileage', // 内部里程

  '/settlementaccount': 'settlement_account', // 结算人管理
  '/oilCard': 'oil_card', // 油卡
  '/driver/ownDriver': 'driver', // 自由驾驶员
  '/driver/driverGrouping': 'driver_group', // 驾驶员分组
  '/tractor': 'tractor', // 牵引车
  '/trailer': 'trailer', // 挂车
  '/truck/ownTruck': 'truck_own', // 自有运力
  '/truck/contractTruck': 'truck_contract', // 合同外协
  '/truck/personalTruck': 'truck_personal', // 个人外协
  '/truck/oilcost': 'truck_oil_cost', // 油耗
  '/truck/truckgroup': 'truck_group', // 运力分组
  '/client': 'client', // 客户
  '/provider': 'provider', // 承运方
  '/vehicleWarehouse': 'vehicle_warehouse', // 商品车仓库管理

  '/transporttype': 'transport_type', // 承运类型
  '/role': 'role', // 角色管理
  '/usermanager': 'user_manager', // 账号管理
  '/department': 'department', // 组织架构
  '/authorise/wjy': 'wjy_company', // 万金油授权管理

  '/order': 'order', // 运单列表
  '/dispatch': 'dispatch', // 调度单列表
  '/dispatchToLoadVehicle': 'dispatch', // 待装车列表
  '/dispatchOnTheWay': 'dispatch', // 在途列表
  '/dispatchToDeliveryVehicle': 'dispatch', // 待交货列表
  '/orderToReply': 'order', // 待回单列表

  '/borrowing': 'dispatch_borrowing', // 借支单列表
  '/supplement': 'dispatch_supplement', // 补款单列表
  '/bankremittance': 'bankcard_pay_records', // 银行卡打款列表
  '/oilremittance': 'oil_card_pay_records', // 油卡打款列表
  '/wjyremittance': 'wjy_pay_records', // 万金油打款列表
  '/defaultremittance': 'default_pay_records', // 其他打款列表

  '/settlement/owndriver': 'dispatch_own_settlement', // 自有驾驶员结算
  '/settlement/personaltruck': 'dispatch_personal_settlement', // 个人外协结算
  '/settlement/owingEntity': 'owing_entity', // 欠款管理
  '/settlement/owingDetail': 'owing_entity_deduct', // 欠款详情

  '/owntruck/costchart': 'own_truck_cost_chart', // 自有车成本报表
  '/custom/chartmanagement': 'custom_chart', // 自定义报表管理列表
  '/custom/chart': 'custom_chart', // 自定义报表管理列表查看报表



  'example': ''
}
