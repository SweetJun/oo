// 结算模块api

const api = process.env.VUE_APP_API

export default {
  dispatchBillSettlement: api + '/dispatch_bill/settlement', // 创建、修改结算单
  owingAmount: api + '/owing/amount', // 获取一个对象的欠款金额
  owingEntities: api + '/owing_entities', // 欠款管理列表
  owingEntitie: api + '/owing_entity', // 欠款详情
  owingRecords: api + '/owing_records', // 欠款详情列表
  carrierBill: api + '/provider_bill', // 承运方账单
  owingRecordRepayments: api + '/owing_record_repayments', // 欠款管理的三级页面
  owingRecord: api + '/owing_record' // 欠款记录的详情信息
}
