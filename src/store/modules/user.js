const company = localStorage.company ? JSON.parse(localStorage.company) : {key: '', value: ''}
const state = {
  // 用户信息
  userInfo: {
    id: '',
    name: ''
  },
  // 公司企业
  company: company
}

const mutations = {
  // 更新用户信息
  updateUserInfo(state, payload) {
    state.userInfo = Object.assign({}, state.userInfo, payload)
  },
  // 更新当前所选企业
  updateCompany(state, payload) {
    localStorage.company = JSON.stringify(payload)
    state.company = payload
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
