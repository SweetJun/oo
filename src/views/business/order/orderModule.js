const state = {
  agency_list: [],
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {}
  },
  roles: {}, // 权限
  apiName: 'orders',
  privileges: [
    'order_add',
    'order_export',
    'order_edit',
    'order_delete',
    'order_set_extra_expense'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  tableData: [],
  searchData: [],
  multipleSelection: [],
  tableHeadList: [
    {
      label: "客户名称",
      prop: "client_display",
      width: 120,
      checked: 1
    },
    {
      label: "运单号",
      prop: "number",
      width: 120,
      checked: 1
    },
    {
      label: "出发地省",
      prop: "from_province_display",
      width: 100,
      checked: 1
    },
    {
      label: "出发地",
      prop: "from_display",
      width: 100,
      checked: 1
    },
    {
      label: "目的地省",
      prop: "to_province_display",
      width: 100,
      checked: 1
    },
    {
      label: "目的地",
      prop: "to_display",
      width: 100,
      checked: 1
    },
    {
      label: "车型",
      prop: "vehicle_show",
      width: 100,
      checked: 1
    },
    {
      label: "数量",
      prop: "vehicle_count",
      width: 70,
      checked: 1
    },
    {
      label: "录入人",
      prop: "creator_id_display",
      checked: 1
    },
    {
      label: "所属办事处",
      prop: "agency_display",
      checked: 1
    },
    {
      label: "下单时间",
      prop: "place_time_display",
      checked: 1
    },
    {
      label: "录单时间",
      prop: "create_time_display",
      checked: 1
    },
    {
      label: "交车时间",
      prop: "delivery_time_display",
      checked: 1
    },
    {
      label: "回单时间",
      prop: "reply_time_display",
      checked: 1
    }
  ]
}

// getters
const getters = {}

// actions
const actions = {
  // 获取办事处
  getAgency: async ({commit}) => {
    let url = `${api.searchItemOption}/agency`
    let data = await $get(url)
    commit('updateAgency', data)
  }
}

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
      item.vehicle_show = item.vehicle_vehicles_display.join(',')
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
  // 更新列表多选数据
  updateSelection(state, payload) {
    state.multipleSelection = payload
  },
  // 更新办事处列表
  updateAgency(state, payload) {
    state.agency_list = payload
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
