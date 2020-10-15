const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {}
  },
  roles: {},
  apiName: 'regions',
  privileges: [
    'region_add',
    'region_export',
    'region_import',
    'region_delete'
  ],
  searchData: [],
  multipleSelection: [],
  tableData: [],
  isLoading: false,
  total: 0,
  tableHeadList: [
    {
      label: '地区名称',
      prop: 'name',
      width: 120,
      checked: 1
    },
    {
      label: '地区类型',
      prop: 'level_name',
      width: 120,
      checked: 1
    },
    {
      label: '所属省',
      prop: 'province',
      width: 100,
      checked: 1
    },
    {
      label: '所属市',
      prop: 'city',
      width: 100,
      checked: 1
    },
    {
      label: '所属区/县',
      prop: 'county',
      width: 100,
      checked: 1
    },
    {
      label: '更新时间',
      prop: 'update_time',
      width: 120,
      checked: 1
    }
  ]
}

// actions
const actions = {}

// mutations
const mutations = {
  // 更新页面搜索内容
  updateSearchData(state, payload) {
    state.searchData = payload
  },
  // 更新data数据
  updateTableData(state, payload) {
    state.tableData = payload
  },
  // 更新数据总条数
  updateTotal(state, payload) {
    state.total = payload
  },
  // 更新表格 loading 状态
  updateLoading(state, payload) {
    state.isLoading = payload
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
  updateRoles(state, payload) {
    state.roles = payload
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
