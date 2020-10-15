const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {}
  },
  roles: {}, // 权限
  apiName: 'truckOwns',
  privileges: [
    'truck_own_add',
    'truck_own_export',
    'truck_own_import',
    'truck_own_cancel_trailer',
    'truck_own_cancel_driver',
    'truck_own_delete'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  searchData: [],
  tableData: [],
  multipleSelection: [],
  tableHeadList: [
    {
      label: '车牌号',
      prop: 'tractor_number',
      width: 100,
      checked: 1
    },
    {
      label: '挂车车牌号',
      prop: 'trailer_number',
      width: 100,
      checked: 1
    },
    {
      label: '驾驶员姓名',
      prop: 'driver_name',
      width: 100,
      checked: 1
    },
    {
      label: '驾驶员手机号',
      prop: 'mobile_phone',
      width: 100,
      checked: 1
    },
    {
      label: '状态',
      prop: 'state_name',
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
