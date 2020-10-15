const state = {
  // 接口调用参数
  params: {},
  id: '',
  entityInfo: {},
  roles: {}, // 权限
  apiName: 'owingRecordRepayments',
  privileges: [
    'owing_entity_deduct_export'
  ],
  // 列表data数据
  isLoading: false,
  searchData: [],
  tableData: [],
  tableHeadList: [
    {
      label: '抵扣场景',
      prop: 'repaid_to_type_display',
      width: 100,
      checked: 1
    },
    {
      label: '抵扣金额',
      prop: 'amount_repaid',
      slotName: 'amount_repaid',
      width: 100,
      checked: 1
    },
    {
      label: '抵扣时间',
      prop: 'repay_time_display',
      width: 80,
      checked: 1
    }
  ]
}

// getters
const getters = {}

// actions
const actions = {
  // 获取基本数据
  getInfo: async ({commit, state}) => {
    commit('updateLoading', true)
    // 接口请求数据
    let data = await $get(`${api.owingRecord}/${state.id}`, {})
    data.status = data.rest_owing_amount !== 0 ? '未结清' : '已结清'
    commit('updateInfo', data)
    commit('updateLoading', false)
  }
}

// mutations
const mutations = {
  // 更新表格 loading 状态
  updateLoading(state, payload) {
    state.isLoading = payload
  },
  // 更新data数据
  updateTableData(state, payload) {
    payload.forEach(item => {
      item.amount_repaid = (item.amount_repaid/100).toFixed(2) > 0 ? `+${(item.amount_repaid/100).toFixed(2)}` : `${(item.amount_repaid/100).toFixed(2)}`
    })
    state.tableData = payload
  },
  // 更新列表表头数据
  updateEditTableList(state, payload) {
    state.tableHeadList = payload
  },
  // 更新列表参数数据
  updateParams(state, payload) {
    state.params = Object.assign({}, state.params, payload)
  },
  // 更新请求额外参数
  updateExcessParams(state, payload) {
    state.excessParams = Object.assign({}, state.excessParams, payload)
  },
  // 更新权限
  updateRoles(state, payload) {
    state.roles = payload
  },
  // 更新id
  updateId(state, payload) {
    state.id = payload
    state.apiName = `owingRecordRepayments/${state.id}`
  },
  // 更新info
  updateInfo(state, payload) {
    state.entityInfo = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
