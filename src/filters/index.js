// 税额固定写死
let s = 1.13

// 详情单 万金油税额计算
export function amountMoney(value) {
  return (value - value / s).toFixed(2)
}

// 详情单不含税额计算
export function noAmountMoney(value) {
  return (value / s).toFixed(2)
}

//保留两位小数点
export function toFixedMonty(value) {
  return Number(value).toFixed(2)
}

/**
 * 银行卡号四位添加空格
 * @param {String} value
 */
export function formatCarNum(value) {
  value = value ? value : '';
  let v = value.toString()
  return v.replace(/\s/g, '').replace(/(.{4})/g, "$1  ")
}

/**
 * 金额格式化
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  let value = Number(num).toFixed(2)
  return (+value || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
/**
 * 车牌号、车架号后四位显示，前面显示 *
 * @param {string, number}
 */
export function carEncryption(val) {
  if (!val) return
  val = val + '';
  let number = val.substr(val.length - 4)
  let length = val.length - 4
  let xing = _.repeat('*', length)
  return xing + number
}
