//
/**
 * @Description: 用于每个页面的搜索项 type
 * @Author: wjw
 * @Date: 2020-03-23 16:22:53
 * @param : key => 对应的每个页面route的 path 属性
 * @param : value => 对应的每个页面获取搜索项的type值，由后台提供
 */
export default {
  '/areamanagement': 'region', // 地区
  '/goodsCar': 'vehicle', // 商品车
  '/goodsCar/brand': 'vehicle_brand', // 商品车品牌
  '/goodsCar/vehicleCode': 'vehicle_code', // 商品车代码
  '/costTypeManagement': 'expense', // 费用类型
  '/dealerManagement': 'dealer', // 经销商

  '/expenserule': 'expense_rule', // 计费策略
  '/clientrule': 'client_rule_set', // 客户结算规则汇总列表
  '/clientrule/price': 'client_rule', // 价格管理
  '/clientrule/missingprice': 'client_miss_rule', // 缺失价格管理
  '/providerule': 'provider_rule_set', // 承运方结算规则汇总列表
  '/providerule/price': 'provider_rule', // 承运方价格管理
  '/providerule/missingprice': 'provider_miss_rule', // 承运方缺失价格管理
  '/oilPrice': 'oil_line', // 油价
  '/mileages': 'mileage', // 内部里程

  '/client': 'client', // 客户
  '/provider': 'provider', // 承运方
  '/oilCard': 'oil_card', // 油卡
  '/driver/ownDriver': 'own_driver', // 自由驾驶员
  '/driver/driverGrouping': 'driver_group', // 驾驶员分组
  '/tractor': 'tractor_list', // 牵引车
  '/trailer': 'trailer_list', // 挂车
  '/truck/ownTruck': 'own_truck', // 自有运力
  '/truck/contractTruck': 'contract_truck', // 合同外协
  '/truck/personalTruck': 'personal_truck', // 个人外协
  '/truck/truckgroup': 'truck_group', // 运力分组
  '/truck/oilcost': 'truck_oil_cost', // 油耗
  '/vehicleWarehouse': 'vehicle_warehouse', // 商品车仓库管理

  '/settlementaccount': 'settlement_account', // 结算人管理
  '/role': 'role', // 角色管理
  '/usermanager': 'user_manager', // 账号管理

  '/order': 'order', // 运单列表
  '/dispatch': 'dispatch', // 调度单列表
  '/dispatchToLoadVehicle': 'dispatch', // 待装车列表
  '/dispatchOnTheWay': 'dispatch', // 在途列表
  '/dispatchToDeliveryVehicle': 'dispatch', // 待交货列表
  '/orderToReply': 'order', // 待回单列表

  '/borrowing': 'dispatch_bill_borrowing', // 借支单列表
  '/supplement': 'dispatch_bill_supplement', // 补款单列表

  '/settlement/dispatchtoaddsettlementbill': 'dispatch', // 待结算调度单
  '/settlement/owndriver': 'dispatch_bill_own_settlement', // 自有驾驶员结算
  '/settlement/personaltruck': 'dispatch_bill_personal_settlement', // 个人外协结算
  '/settlement/owingEntity': 'owing_entity', // 欠款管理
  '/settlement/owingEntity/detail': 'owing_record', // 欠款详情
  '/settlement/carrierbill': 'provider_bill', // 承运方账单

  '/bankremittance': 'pay_record', // 银行卡打款
  '/oilremittance': 'pay_record', // 油卡卡打款
  '/wjyremittance': 'pay_record', // 万金油卡打款
  '/defaultremittance': 'pay_record', // 万金油卡打款

  '/owntruck/costchart': 'own_truck_dispatch_cost_chart', // 自有车成本报表
  '/custom/chartmanagement': 'custom_chart', // 自定义报表管理列表
  '/custom/chart': 'custom_chart', // 自定义报表查看列表


  '/example': ''
}
