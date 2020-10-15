const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {}
  },
  roles: {}, // 权限
  apiName: 'owingEntities',
  privileges: [
    'owingEntity_export',
    'owing_entity_deduct_list'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  searchData: [],
  tableData: [],
  tableHeadList: [
    {
      label: '类型',
      prop: 'type_display',
      width: 100,
      checked: 1
    },
    {
      label: '姓名',
      prop: 'entity_name',
      width: 100,
      checked: 1
    },
    {
      label: '手机号',
      prop: 'entity_mobile',
      width: 80,
      checked: 1
    },
    {
      label: '欠款金额',
      prop: 'owing_amount',
      slotName: 'owing_amount',
      width: 100,
      checked: 1
    }
  ]
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  // 更新页面搜索内容
  updateSearchData(state, payload) {
    state.searchData = payload
  },
  // 更新表格 loading 状态
  updateLoading(state, payload) {
    state.isLoading = payload
  },
  // 更新数据总条数
  updateTotal(state, payload) {
    state.total = payload
  },
  // 更新data数据
  updateTableData(state, payload) {
    payload.forEach(item => {
      item.owing_amount = (item.owing_amount/100).toFixed(2) > 0 ? `+${(item.owing_amount/100).toFixed(2)}` : `${(item.owing_amount/100).toFixed(2)}`
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
  // 更新权限
  updateRoles(state, payload) {
    state.roles = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
