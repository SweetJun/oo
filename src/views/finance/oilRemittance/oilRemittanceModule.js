const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 10,
    pay_method: 'oil_card',
    pay_state: 'ready',
    condition: {}
  },
  extraCondition: {},
  roles: {}, // 权限
  apiName: 'remittance',
  privileges: [
    "oil_card_pay_records_pay",
    "oil_card_pay_records_export",
    "settlement_account_edit"
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  tableData: [],
  searchData: [],
  multipleSelection: [],
  tableHeadList: [
    {
      label: '单据编号',
      prop: 'bill_number',
      width: '150',
      checked: 1
    },
    {
      label: '场景',
      width: '100',
      prop: 'bill_type_display',
      checked: 1
    },
    {
      label: '金额(元) ',
      prop: 'amount',
      width: '100',
      sortable: true,
      checked: 1
    },
    {
      label: '收款人姓名',
      prop: 'receiver_name',
      width: '100',
      checked: 1
    },
    {
      label: '收款人手机号',
      prop: 'receiver_mobile',
      width: '120',
      checked: 1
    },
    {
      label: '油卡品牌',
      prop: 'card_brand_display',
      slotName: 'card_brand_display',
      width: '100',
      checked: 1
    },
    {
      label: '油卡卡号',
      prop: 'card_number',
      slotName: 'card_number',
      width: '150',
      checked: 1
    },
    {
      label: '申请人',
      prop: 'creator_id_display',
      width: '100',
      checked: 1
    },
    {
      label: '申请时间',
      prop: 'create_time_display',
      width: '150',
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
    payload.map(ele => {
      ele.card_brand_display = ele.settlement_pay_method_display.card_brand_display
      ele.card_number = ele.settlement_pay_method_display.card_number
      ele.amount = Number(ele.amount) / 100
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
    state.extraCondition = {
      pay_method: state.params.pay_method,
      pay_state: state.params.pay_state
    }
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
