const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {},
    options: {
      bill_type: 'dispatch_borrowing'
    }
  },
  roles: {}, // 权限
  apiName: 'dispatchBills',
  privileges: [
    'dispatch_borrowing_export',
    'dispatch_borrowing_add',
    'dispatch_borrowing_edit',
    'dispatch_borrowing_delete'
  ],
  payMethodTotal: {
    bank_card: 0,
    oil_card: 0,
    wjy: 0
  },
  // 列表data数据
  total: 0,
  isLoading: false,
  searchData: [],
  tableData: [],
  tableHeadList: [
    {
      label: '借支单号',
      prop: 'bill_number',
      width: 100,
      checked: 1
    },
    {
      label: '调度单号',
      prop: 'dispatch_number',
      width: 100,
      checked: 1
    },
    {
      label: '金额（元）',
      prop: 'amount',
      width: 100,
      sortable: true,
      checked: 1
    },
    {
      label: '状态',
      prop: 'pay_state_display',
      width: 80,
      checked: 1
    },
    {
      label: '承运类型',
      prop: 'dispatch_transport_type_name',
      width: 100,
      checked: 1
    },
    {
      label: '驾驶员姓名',
      prop: 'dispatch_truck_driver_name',
      width: 100,
      checked: 1
    },
    {
      label: '驾驶员手机号',
      prop: 'dispatch_truck_driver_mobile',
      width: 100,
      checked: 1
    },
    {
      label: '车牌号',
      prop: 'dispatch_truck_tractor_number',
      width: 80,
      checked: 1
    },
    {
      label: '创建时间',
      prop: 'create_time_display',
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
      item.amount = Number(item.amount) / 100
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
  },
  // 更新总金额
  updatePayMethodTotal(state, payload) {
    state.payMethodTotal = Object.assign({}, state.payMethodTotal, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
