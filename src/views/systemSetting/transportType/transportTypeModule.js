const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10
  },
  roles: {}, // 权限
  apiName: 'transportTypes',
  privileges: [
    'transport_type_add'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  tableData: [],
  tableHeadList: [
    {
      label: '承运类型名称',
      prop: 'name',
      width: 140,
      checked: 1
    },
    {
      label: '承运方',
      prop: 'truck_type_display',
      width: 100,
      checked: 1
    },
    {
      label: '是否给借支',
      prop: 'prepayment_display',
      width: 100,
      checked: 1
    },
    {
      label: '是否给补款',
      prop: 'midway_supplement_display',
      width: 100,
      checked: 1
    },
    {
      label: '状态',
      prop: 'status_display',
      width: 100,
      checked: 1
    },
    {
      label: '创建时间',
      prop: 'create_time',
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
