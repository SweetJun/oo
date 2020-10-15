const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {},
    state: 'to_add_settlement_bill'
  },
  roles: {}, // 权限
  apiName: 'dispatches',
  transportTypeList: [], // 承运类型
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
      label: '承运运单',
      prop: 'order_numbers',
      width: 120,
      checked: 1
    },
    {
      label: '出发地',
      prop: 'from_display',
      width: 100,
      checked: 1
    },
    {
      label: '途径地',
      prop: 'internal_points_display',
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
      label: '承运类型',
      prop: 'transport_type_display',
      width: 100,
      checked: 1
    },
    {
      label: '承运方',
      prop: 'transport_unit_display',
      width: 100,
      checked: 1
    },
    {
      label: '驾驶员姓名',
      prop: 'truck_driver_name',
      width: 100,
      checked: 1
    },
    {
      label: '驾驶员手机号',
      prop: 'truck_driver_mobile',
      width: 100,
      checked: 1
    },
    {
      label: '车牌号',
      prop: 'truck_tractor_number',
      width: 80,
      checked: 1
    },
    {
      label: '承运台数',
      prop: 'vehicle_count',
      width: 100,
      sortable: true,
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
  },
  // 更新承运类型
  updateTransportTypeList(state, payload) {
    state.transportTypeList = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
