//
/**
 * @Description: 用于每个页面的导入 type
 * @Author: wjw
 * @Date: 2020-03-23 16:22:53
 * @param : key => 对应的每个页面route的 path 属性
 * @param : value => 对应的每个页面导入的type值，由后台提供
 */
export default {
  '/areamanagement': 'region', // 地区
  '/costTypeManagement': 'expense', // 费用类型
  '/goodsCar/vehicleCode': 'vehicle_code', // 车型代码

  '/clientrule/price': 'client_rule', // 客户价格管理
  '/providerule/price': 'provider_rule', // 承运方价格管理
  '/mileages': 'mileage', // 内部里程

  '/settlementaccount': 'settlement_account', // 结算人管理
  '/oilCard': 'oil_card', // 油卡
  '/driver/ownDriver': 'driver', // 驾驶员
  '/tractor': 'tractor', // 牵引车
  '/trailer': 'trailer', // 挂车
  '/truck/ownTruck': 'own_truck', // 自有运力
  '/truck/contractTruck': 'contract_truck', // 合同外协
  '/truck/personalTruck': 'personal_truck', // 个人外协


  '/order': 'order', // 运单列表
  '/dispatch': 'dispatch', // 调度单列表

  '/example': ''
}
