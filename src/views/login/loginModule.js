const state = {
  cook: '1'
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  // 更新页面搜索内容
  updateCook(state, payload) {
    state.cook = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
