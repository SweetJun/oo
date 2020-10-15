const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    set_id: '',
    condition: {}
  },
  extraCondition: {},
  roles: {}, // 权限
  apiName: 'clientMissRule',
  privileges: [
    'client_miss_rule_export'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  tableData: [],
  searchData: [],
  tableHeadList: [
    {
      label: '起运地',
      prop: 'from_display',
      width: '100',
      checked: 1
    },
    {
      label: '目的地',
      width: '100',
      prop: 'to_display',
      checked: 1
    },
    {
      label: '结算方式',
      prop: 'calculate_mode_display',
      width: '100',
      checked: 1
    },
    {
      label: '适用品牌/车型',
      prop: 'brand_vehicle_display',
      width: '140',
      checked: 1
    },
    {
      label: '单价',
      prop: 'price',
      width: '100',
      checked: 1
    },
    {
      label: '里程数',
      prop: 'mileage',
      width: '100',
      checked: 1
    },
    {
      label: '有效期至',
      prop: 'effect_end_time',
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
    state.extraCondition = {
      set_id: state.params.set_id
    }
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
