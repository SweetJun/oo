const state = {
  // 接口调用参数
  params: {
    page: 1,
    per_page: 20,
    condition: {},
    includeChildren: false
  },
  departmentId: '',
  roles: {}, // 权限
  apiName: 'departmentUsers',
  privileges: [
    'department_add',
    'department_edit',
    'department_delete',
    'department_user_add'
  ],
  // 列表data数据
  total: 0,
  isLoading: false,
  tableData: [],
  tableHeadList: [
    {
      label: '姓名',
      prop: 'name',
      width: 100,
      checked: 1
    },
    {
      label: '手机号',
      prop: 'phone_no',
      width: 100,
      checked: 1
    },
    {
      label: '角色',
      prop: 'role_name',
      width: 100,
      checked: 1
    },
    {
      label: '所属部门',
      prop: 'department_display',
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
    state.params.includeChildren = state.params.includeChildren ? 1 : 0
  },
  // 更新部门id
  updateDepartmentId(state, payload) {
    state.departmentId = payload
    state.apiName = `departmentUsers/${state.departmentId}`
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
