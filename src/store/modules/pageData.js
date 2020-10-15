import store from '../index'

const state = {
  count: 3, // 列表表头吸顶依赖三个接口完成，再计算滚动高度
  firstColumnFixed: false
}

const actions = {
  getSearchData: async ({commit, state}, payload) => {
    let searchType = $search[window.location.pathname]
    if (!searchType) {
      commit('updateCount', --state.count)
      return
    }
    let data = await $get(`${api.searchItemConfig}/${searchType}`)
    store.commit(`${payload}/updateSearchData`, data)
    commit('updateCount', --state.count)
  },

  getPrivileges: async({commit, state}, payload) => {
    const privileges = store.state[payload].privileges
    if (_.isArray(privileges) && privileges.length > 0) {
      let params = {
        privileges: JSON.stringify(privileges)
      }
      let data = await $get(api.privilegesCheck, params)
      store.commit(`${payload}/updateRoles`, data)
      commit('updateCount', --state.count)
    } else {
      commit('updateCount', --state.count)
    }
  },

  getTableData: async ({commit, state}, payload) => {
    store.commit(`${payload}/updateLoading`, true)
    const apiName = store.state[payload].apiName
    let apiUrl = ''
    let index = apiName.indexOf('/')
    if (index > -1) {
      apiUrl = `${api[apiName.split('/')[0]]}/${apiName.slice(index + 1)}`
    } else {
      apiUrl = api[apiName]
    }
    const params = store.state[payload].params
    let data = await $get(apiUrl, params)
    store.commit(`${payload}/updateLoading`, false)
    store.commit(`${payload}/updateTotal`, data.total);
    store.commit(`${payload}/updateTableData`, data.data ? data.data : data)
    commit('updateCount', --state.count)
    if (data.list_header) {
      store.commit(`${payload}/updateEditTableList`, data.list_header);
    }
  }
}

const mutations = {
  // 首列是否固定
  updateColumnFixed(state, payload) {
    state.firstColumnFixed = payload
  },
  updateCount(state, payload) {
    state.count = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
