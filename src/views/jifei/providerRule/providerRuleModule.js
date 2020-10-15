const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {}
  },
  roles: {}, // 权限
  apiName: 'providerRuleSet',
  privileges: [
    'provider_rule_set_add'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  tableData: [],
  searchData: [],
  tableHeadList: [
    {
      label: '承运方名称',
      prop: 'related_display',
      width: '120',
      checked: 1
    },
    {
      label: '缺失线路',
      width: '80',
      prop: 'miss',
      slotName: 'miss',
      checked: 1
    },
    {
      label: '暂估线路',
      prop: 'estimate',
      width: '80',
      checked: 1
    },
    {
      label: '即将到期',
      width: '80',
      prop: 'estimate_expiring',
      slotName: 'estimate_expiring',
      checked: 1
    },
    {
      label: '待续期',
      width: '80',
      prop: 'estimate_expired',
      slotName: 'estimate_expired',
      checked: 1
    },
    {
      label: '结算线路',
      prop: 'contract',
      width: '80',
      checked: 1
    },
    {
      label: '即将到期',
      width: '80',
      prop: 'contract_expiring',
      slotName: 'contract_expiring',
      checked: 1
    },
    {
      label: '待续期',
      width: '80',
      prop: 'contract_expired',
      slotName: 'contract_expired',
      checked: 1
    },
    {
      label: '最近更新时间',
      prop: 'update_time',
      width: '100',
      checked: 1
    },
    {
      label: '最近操作人',
      prop: 'last_editor_name',
      width: '100',
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
