const tabs = localStorage.tags ? JSON.parse(localStorage.tags) : [{ label: '首页', name: '/home' }];
const state = {
  // 导航栏菜单是否隐藏
  isCollapse: false,
  tabs: tabs
}

const mutations = {
  // 更新二级导航显示隐藏
  updateCollapse(state, payload) {
    state.isCollapse = payload
  },
  // 更新tabs
  updateTabs(state, payload) {
    localStorage.tags = JSON.stringify(payload)
    state.tabs = payload
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
