/**
 * @Description: 每个页面store的命名空间(spaceName)
 * @Author: wjw
 * @Date: 2020-10-14 14:30:23
 * key => 对应的每个页面route的 path 属性
 * value => 对应的每个页面的命名空间（storeModelName）
 */

export default {
  '/areamanagement': 'areamanagementModule', // 地区
  '/goodsCar': 'goodsCarModule', // 商品车
  '/goodsCar/brand': 'brandModule', // 商品车品牌
  '/goodsCar/vehicleCode': 'vehicleCodeModule', // 商品车代码
  '/costTypeManagement': 'costTypeManagementModule', // 费用类型
  '/dealerManagement': 'dealerManagementModule', // 经销商

  '/clientrule': 'clientRuleModule', // 客户价格管理
  '/clientrule/price': 'clientRulePriceModule', // 客户价格管理
  '/clientrule/missingprice': 'clientRuleMissingPriceModule', // 客户缺失价格管理
  '/providerule': 'providerRuleModule', // 承运方规则汇总表
  '/providerule/price': 'providerRulePriceModule', // 承运方价格管理
  '/providerule/missingprice': 'providerRuleMissingPriceModule', // 承运方缺失价格管理
  '/expenserule': 'providerRuleMissingPriceModule', // 计费策略管理
  '/oilPrice': 'oilPriceModule', // 油价
  '/mileages': 'mileagesModule', // 内部里程

  '/settlementaccount': 'settlementAccountModule', // 结算人管理
  '/oilCard': 'oilCardModule', // 油卡
  '/driver/ownDriver': 'driverGroupingModule', // 自由驾驶员
  '/driver/driverGrouping': 'driverGroupingModule', // 驾驶员分组
  '/tractor': 'tractorModule', // 牵引车
  '/trailer': 'trailerModule', // 挂车
  '/truck/ownTruck': 'ownTruckModule', // 自有运力
  '/truck/contractTruck': 'contractTruckModule', // 合同外协
  '/truck/personalTruck': 'personalTruckModule', // 个人外协
  '/truck/oilcost': 'oilCostModule', // 油耗
  '/truck/truckgroup': 'truckGroupModule', // 运力分组
  '/client': 'clientModule', // 客户
  '/provider': 'providerModule', // 承运方
  '/vehicleWarehouse': 'vehicleWarehouseModule', // 商品车仓库管理

  '/transporttype': 'transportTypeModule', // 承运类型
  '/role': 'roleModule', // 角色管理
  '/usermanager': 'userManagerModule', // 账号管理
  '/department': 'departmentModule', // 组织架构
  '/authorise/wjy': 'wjyAuthoriseModule', // 万金油授权管理

  '/order': 'orderModule', // 运单列表
  '/dispatch': 'dispatchModule', // 调度单列表
  '/dispatchToLoadVehicle': 'dispatchToLoadVehicleModule', // 待装车列表
  '/dispatchOnTheWay': 'dispatchOnTheWayModule', // 在途列表
  '/dispatchToDeliveryVehicle': 'dispatchToDeliveryVehicleModule', // 待交货列表
  '/orderToReplyModule': 'order', // 待回单列表

  '/borrowing': 'borrowingModule', // 借支单列表
  '/supplement': 'supplementModule', // 补款单列表
  '/bankremittance': 'bankRemittanceModule', // 银行卡打款列表
  '/oilremittance': 'oilRemittanceModule', // 油卡打款列表
  '/wjyremittance': 'wjyRemittanceModule', // 万金油打款列表
  '/defaultremittance': 'defaultRemittanceModule', // 其他打款列表

  '/settlement/dispatchtoaddsettlementbill': 'dispatchToAddSettlementBillModule', // 待结算调度单
  '/settlement/owndriver': 'ownDriverSettlementModule', // 自有驾驶员结算
  '/settlement/personaltruck': 'personalTruckSettlementModule', // 个人外协结算
  '/settlement/carrierbill': 'carrierBillModule', // 承运商账单
  '/settlement/owingEntity': 'owingEntityModule', // 欠款管理
  '/settlement/owingEntity/detail': 'owingDetailModule', // 欠款详情
  '/settlement/owingEntity/detailDetail': 'owingDetailDetailModule', // 欠款详情/详情

  '/owntruck/costchart': 'ownTruckCostModule', // 自有车成本报表
  '/custom/chartmanagement': 'customChartManagementModule', // 自定义报表管理列表
  '/custom/chart': ['customChartModule', 'customChartDialogModule'] // 自定义报表管理列表查看报表
}
