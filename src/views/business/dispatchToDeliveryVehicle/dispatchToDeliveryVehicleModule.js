const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {},
    state: 'to_deliver_vehicle'
  },
  roles: {}, // 权限
  apiName: 'dispatches',
  privileges: [
    'dispatch_export',
    'dispatch_deliver_vehicle'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  searchData: [],
  tableData: [],
  tableHeadList: [
    {
      label: '调度单号',
      prop: 'number',
      width: 120,
      checked: 1
    },
    {
      label: '运单号',
      prop: 'order_numbers',
      width: 120,
      checked: 1
    },
    {
      label: '承运类型',
      prop: 'transport_type_display',
      width: 120,
      checked: 1
    },
    {
      label: '承运方',
      prop: 'transport_unit_display',
      width: 100,
      checked: 1
    },
    {
      label: '驾驶员',
      prop: 'truck_driver_name',
      width: 100,
      checked: 1
    },
    {
      label: '车牌号',
      prop: 'truck_tractor_number',
      width: 100,
      checked: 1
    },
    {
      label: '出发地',
      prop: 'from_display',
      width: 100,
      checked: 1
    },
    {
      label: '目的地',
      prop: 'to_display',
      width: 100,
      checked: 1
    },
    {
      label: '台数',
      prop: 'vehicle_count',
      width: 100,
      checked: 1
    },
    {
      label: '创建时间',
      prop: 'create_time_display',
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
