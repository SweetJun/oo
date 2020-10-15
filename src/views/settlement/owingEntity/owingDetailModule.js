const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    condition: {}
  },
  id: '',
  entityInfo: {},
  roles: {}, // 权限
  apiName: 'owingRecords',
  privileges: [
    'owing_entity_deduct_export'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  searchData: [],
  tableData: [],
  tableHeadList: [
    {
      label: '财务单据号',
      prop: 'cause_id_display',
      width: 100,
      checked: 1
    },
    {
      label: '金额',
      prop: 'owing_amount',
      width: 100,
      slotName: 'owing_amount',
      checked: 1
    },
    {
      label: '状态',
      prop: 'status',
      slotName: 'status',
      width: 80,
      checked: 1
    },
    {
      label: '生成场景',
      prop: 'cause_type_display',
      width: 100,
      checked: 1
    },
    {
      label: '生成时间',
      prop: 'create_time_display',
      width: 100,
      checked: 1
    }
  ]
}

// getters
const getters = {}

// actions
const actions = {
  // 获取基本数据
  getInfo: async ({commit, state}) => {
    commit('updateLoading', true)
    // 接口请求数据
    let data = await $get(`${api.owingEntitie}/${state.id}`, state.params)
    commit('updateInfo', data)
    commit('updateLoading', false)
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
      item.status = item.rest_owing_amount === 0 ? '已结清' : '未结清'
      item.owing_amount = (item.owing_amount/100).toFixed(2) > 0 ? `+${(item.owing_amount/100).toFixed(2)}` : `${(item.owing_amount/100).toFixed(2)}`
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
  // 更新id
  updateId(state, payload) {
    state.id = payload
    state.apiName = `owingRecords/${state.id}`
  },
  // 更新info
  updateInfo(state, payload) {
    state.entityInfo = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
