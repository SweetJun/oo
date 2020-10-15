/* eslint-disable */
import {isIdCard, isPhone, isCarNumber, isNumber, isFloatNumber} from './utils'

const Validator = {
  // 手机校验
  isPhone(required = true, msg = '请输入手机号') {
    var validPhone = (rule, value, callback) => {
      if (required) {
        if (!value) {
          callback(new Error(msg))
        } else if (!isPhone(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback()
        } else if (!isPhone(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    }
    return validPhone
  },
  // 身份证号校验
  isIdCard() {
    let validIdCard = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号'))
      } else if (!isIdCard(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
    return validIdCard
  },
  // 车牌号校验
  isCarNumber(msg = '请输入车牌号') {
    let validCarNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error(msg))
      } else if (!isCarNumber(value)) {
        callback(new Error('请输入正确的车牌号'))
      } else {
        callback()
      }
    }
    return validCarNumber
  },
  /**
 * @desc   判断是否是非0开头的数字
 * @param  {Boolean} required 是否验证必填
 * @param  {String} msg 错误提示
 * @return {Boolean}
 */
  isNumber(required = true, msg = '此项内容不能为空') {
    let validNumber = (rule, value, callback) => {
      if (required) {
        if (!value) {
          callback(new Error(msg))
        } else if (!isNumber(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback()
        } else if (!isNumber(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }
    }
    return validNumber
  },
  // 正数校验，最多两位小数
  isFloatNumber(required = true, msg = '此项内容不能为空') {
    let validFloatNumber = (rule, value, callback) => {
      if (required) {
        if (!value) {
          callback(new Error(msg))
        } else if (!isFloatNumber(value)) {
          callback(new Error('请输入最多两位小数的数字'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback()
        } else if (!isFloatNumber(value)) {
          callback(new Error('请输入最多两位小数的数字'))
        } else {
          callback()
        }
      }
    }
    return validFloatNumber
  },
  // 百分比校验
  isPercent(msg = '请输入0-100的数字') {
    var validPercent = (rule, value, callback) => {
      if (!value) {
        callback(new Error(msg))
      } else if (!isFloatNumber(value)) {
        callback(new Error('请输入最多两位小数的数字'))
      } else if (isFloatNumber(value) && (Number(value) > 100 || Number(value) < 0)) {
        callback(new Error('请输入0-100的数字'))
      } else {
        callback()
      }
    }
    return validPercent
  }
}

// 对Validator的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, "$valid", { value: Validator });
  }
}
