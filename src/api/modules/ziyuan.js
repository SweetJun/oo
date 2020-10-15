// 资源模块api

const api = process.env.VUE_APP_API

export default {
  bankCardPackets: api + '/bankcard_packets', // 银行卡列表
  bankcardPacket: api + '/bankcard_packet', // 银行卡信息
  bankcardPacketBatchDel: api + '/bankcard_packet/batch/delete', // 删除

  settlementAccount: api + '/settlement_account', // 创建、获取，删除、编辑结算人
  settlementAccountBatchDel: api + '/settlement_account/batch/delete', // 批量删除结算人
  truckSettlementAccount: api + '/truck/settlement_account', // 根据运力获取结算人
  settlementAccountSearchByKeyword: api + '/settlement_account/search/by/keyword', // 根据名称获取结算人(关联用)
  getAvailableWjyCompany: api + '/get_available_wjy_company', // 万金油企业下拉列表
  isBindWjy: api + '/is_bind_wjy', // 判断是否绑定了万金油企业

  oilCards: api + '/oil_cards', // 油卡
  oilCard: api + '/oil_card', // 编辑添加删除油卡
  oilCardDamage: api + '/oil_card/damage', // 损坏
  oilCardBatchDelete: api + '/oil_card/batch/delete', // 批量删除
  oilCardBrands: api + '/oil_card/brands', // 获取油卡品牌
  tractorOptions: api + '/tractor_options', // 获取牵引车下拉
  driverOptions: api + '/driver_options', // 获取驾驶员下拉

  tractor: api + '/tractor', // 牵引车列表
  truck_unit_type_options: api + '/truck_unit_type_options', // 添加车辆里车辆类型下拉数据
  truck_unit: api + '/truck_unit', // 图片
  delete_tractor: api + '/tractor_delete', // 删除牵引车

  trailer: api + '/trailer', // 挂车列表
  trailerOptions: api + '/trailer_options', // 挂车下拉
  deleteTrailer: api + '/trailer_delete', // 删除挂车

  providerSearchByName: api + '/provider/search/by/name', // 承运方下拉搜索

  driverGroup: api + '/driver_group', // 驾驶员分组列表
  driverGroupOptions: api + '/driver_group_options', // 驾驶员分组下拉数据

  driver: api + '/driver', // 自有驾驶员
  driverDelete: api + '/driver_delete', // 自有驾驶员删除
  driver_options: api + '/driver_options', // 驾驶员下拉数据
  driver_type_options: api + '/driver_type_options', //  驾驶员类型下拉
  bankcard_packet_by_name: api + '/bankcard_packet/by/name', //驾驶员绑定结算人
  bankcard_packet: api + '/bankcard_packet', // 根据结算人获取结算人下的银行卡信息
  oil_card_no_relations: api + '/oil_card/no/relations', // 获取未绑定的加油卡下拉数据

  clients: api + '/clients', // 客户列表
  partner_enums_by_type: api + '/partner/enums/by/type', // 获取类型和图片类型
  client: api + '/client', // 客户添加

  providers: api + '/providers', // 承运方列表
  provider: api + '/provider', // 承运方添加

  truckOwns: api + '/truck_owns', // 自有运力列表
  truckOwn: api + '/truck_own', // 运力详情、编辑、删除、创建
  truckGroupOptions: api + '/truck_group_options', // 运力分组下拉
  truckOwnMatchTrailer: api + '/truck_own/match/trailer', // 配板
  truckOwnCancelTrailer: api + '/truck_own/cancel/trailer', // 拆板
  truckOwnMatchDriver: api + '/truck_own/match/driver', // 上车
  truckOwnCancelDriver: api + '/truck_own/cancel/driver', // 下车
  truckOwnDelete: api + '/truck_own/delete', // 批量删除
  truckOwnBatchCancelTrailer: api + '/truck_own/batch/cancel/trailer', // 批量拆板
  truckOwnBatchCancelDriver: api + '/truck_own/batch/cancel/driver', // 批量下车

  truckContracts: api + '/truck_contracts', // 获取合同外协
  truckContract: api + '/truck_contract', // 创建、获取、删除、编辑合同外协
  truckContractDelete: api + '/truck_contract/delete', // 批量删除合同外协

  truckPersonals: api + '/truck_personals', // 获取个人外协
  truckPersonal: api + '/truck_personal', // 创建、获取、删除、编辑个人外协
  truckPersonalDelete: api + '/truck_personal/delete', // 批量删除个人外协
  departments: api + '/departments', // 获取部门树

  oilCosts: api + '/oil/costs', // 运力油耗设置列表
  oilCost: api + '/oil/cost', // 设置运力油耗
  oilCostBatchSet: api + '/oil/cost/batch_set', // 批量设置运力油耗

  truckGroups: api + '/truck_groups', // 运力分组列表
  truckGroup: api + '/truck_group', // 运力分组
  truckOwnsBrief: api + '/truck_owns/brief', // 运力下拉列表

  vehicleWarehouse: api + '/vehicle_warehouse', // 商品车仓库列表
  vehicleWarehouseBatchDelete: api + '/vehicle_warehouse_batch_delete' // 批量删除商品车仓库
}
