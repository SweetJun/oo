const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {}
  },
  query: '', // 由商品车管理操作按钮跳转带来的参数
  roles: {}, // 权限
  apiName: 'vehicleCodes',
  privileges: [
    'vehicle_code_add',
    'vehicle_code_export',
    'vehicle_code_import',
    'vehicle_code_delete'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  searchData: [],
  tableData: [],
  multipleSelection: [],
  tableHeadList: [
    {
      label: '车型代码',
      prop: 'code',
      width: 120,
      checked: 1
    },
    {
      label: '所属车型',
      prop: 'vehicle_name',
      width: 120,
      checked: 1
    },
    {
      label: '更新时间',
      prop: 'update_time',
      width: 120,
      sortable: true,
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
    payload.forEach(item => {
      if (item.id === 'vehicle_name') {
        state.params.condition['vehicle_name'] = state.query
        item.options = state.query ? [state.query] : []
        return false
      }
    })
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
  // 更新列表多选数据
  updateSelection(state, payload) {
    state.multipleSelection = payload
  },
  // 更新列表多选数据
  updateQuery(state, payload) {
    state.query = payload
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
