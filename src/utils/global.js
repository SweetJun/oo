// 全局的一些方法，可以通过this.xxx 调用

import { MessageBox } from 'element-ui'
import Print from 'print-js/dist/print'

/**
 * @Description: 确认消息 （提示用户确认其已经触发的动作，并询问是否进行此操作）
 * @Author: wjw
 * @Date: 2020-01-07 17:34:48
 * 用法：this.confirm('这是confirm弹框').then(() => {}).catch(() => {})}
 */
export function confirm(msg = '确定执行此操作吗？', title='提示', type = 'warning', center = false) {
  return MessageBox.confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: type,
    center: center
  })
}
/**
 * @Description: 消息提示框 （该对话框中断用户操作，直到用户确认知晓后才可关闭）
 * @Author: wjw
 * @Date: 2020-01-07 17:37:27
 * 用法：this.alert('这是alert弹框').then(() => {}).catch(() => {})}
 */
export function alert(msg= '确定执行此操作吗？') {
  return MessageBox.alert(msg, '提示', {
    confirmButtonText: '确定'
  })
}
/**
 * @Description: 验证权限
 * @Author: wjw
 * @Date: 2020-04-06 17:37:27
 */
export async function checkPrivileges(privileges = []) {
  if (!privileges || privileges.length === 0) return
  let params = {
    privileges: JSON.stringify(privileges)
  }
  let data = await $get(api.privilegesCheck, params)
  return data
}

/**
 * @Description: 元单位转化为以分为单位  1 => 100
 * @Author: wjw
 * @Date: 2020-04-28 17:37:27
 */
export function moneyYuanToCent(value = 0) {
  return Number((Number(value) * 100).toFixed(2))
}
/**
 * @Description: 以分单位转化为以元为单位  100 => 1
 * @Author: wjw
 * @Date: 2020-04-28 17:37:27
 */
export function moneyCentToYuan(value = 0) {
  return Number((Number(value) / 100).toFixed(2))
}
/**
 * @Description: 打印功能
 * @Author: wjw
 * @param {id} 容器id
 * @param {title} 打印的标题
 * @param {type} 打印类型  pdf  html等
 * @Date: 2020-04-30 19:37:27
 */
export function $print(id, title, type = 'html') {
  Print({
    printable: id,
    documentTitle: title,
    header: title,
    headerStyle: 'display:block;text-align: center;font-size:16px;color:#000;font-weight: 400;',
    type: type,
    targetStyles: ['*'] // 继承原来的所有样式
  })
}
