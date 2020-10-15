// 基础信息模块api

const api = process.env.VUE_APP_API

export default {
  vehicles: api + '/vehicles', // 获取商品车列表
  vehicle: api + '/vehicle', // 添加编辑或删除商品车
  vehicleBatchDelete: api + '/vehicle/batch/delete', // 批量删除商品车

  vehicleBrands: api + '/vehicle_brands', // 获取商品车品牌列表
  vehicleBrand: api + '/vehicle_brand', // 添加商品车品牌
  vehicleBrandBatchDel: api + '/vehicle_brand/batch/delete', // 批量删除商品车品牌
  searchVehicleBrand: api + '/search/vehicle_brand', // 商品车品牌下拉（旧）

  vehicleCodes: api + '/vehicle_codes', // 获取车型代码列表
  vehicleCode: api + '/vehicle_code', // 添加车型代码
  vehicleCodeBatchDel: api + '/vehicle_code/batch/delete', // 批量删除车型代码
  searchVehicle: api + '/search/vehicle', // 所属车型下拉

  regions: api + '/regions', // 获取地区列表
  region: api + '/region', // 地区
  regionBatchDelete: api + '/region/batch/delete', // 批量删除地区

  dealers: api + '/dealers', // 经销商管理列表
  dealer: api + '/dealer', // 添加编辑经销商
  deleteDealer: api + '/delete_dealer', // 删除经销商
  dealerDetail: api + '/dealer', // 经销商详情

  expense: api + '/expense', // 费用列表，添加编辑费用
  expense_category_options: api + '/expense_category_options', // 费用所属类目
  expense_disable: api + '/expense_disable' // 费用禁用
}
