// 财务模块api

const api = process.env.VUE_APP_API

export default {
  dispatchBillBorrowing: api + '/dispatch_bill/borrowing', // 创建、修改借支单
  remittance: api + '/pay_records', // 银行卡打款/加油卡打款/万金油打款
  remitMoney: api + '/pay_record', // 执行打款操作
  dispatchBills: api + '/dispatch_bills', // 费用单据列表
  dispatchBill: api + '/dispatch_bill', // 删除费用单据
  dispatchBillSupplement: api + '/dispatch_bill/supplement' // 创建、修改补款单
}
