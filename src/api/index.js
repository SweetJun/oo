import axios from './config'
import { transfromForBackend, filterOutType } from '@/utils/transformSearchData'

// post默认请求
export function post(apiUrl, params) {
  return axios.post(apiUrl, params)
}

// get默认请求
export function get(apiUrl, params) {
  let data = _.cloneDeep(params)
  let postData = {}
  if (data && data.page && data.per_page) {
    let pager = {
      page: data.page,
      per_page: data.per_page
    }
    let pagerParams = {pager: JSON.stringify(pager)}

    let condition = transfromForBackend(data.condition) // 把搜索组件绑定的值转换为后台需要的格式
    let conditionParams = filterOutType(condition) // 传给后台时过滤掉type属性
    let remainderParams = _.omit(data, ['page', 'per_page', 'condition'])
    postData = Object.assign({}, pagerParams, conditionParams, remainderParams)
  } else {
    postData = params
  }
  return axios.get(apiUrl, { params: postData })
}

// put默认请求
export function $put(apiUrl, params) {
  return axios.put(apiUrl, params)
}
// delete默认请求
export function $delete(apiUrl, params) {
  return axios.delete(apiUrl, { data: params })
}


