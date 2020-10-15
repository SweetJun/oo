import { transfromForBackend, filterOutType } from '@/utils/transformSearchData'

import localforage from 'localforage'
const state = {
  // 接口调用参数
  params: {
    condition: {}
  },
  pager: '',
  currentRow: {},
  editTableHeaderByRow: true,
  privileges: [
    'custom_chart_export'
  ],
  extraCondition: {},
  roles: {}, // 权限
  // 列表data数据
  total: 0,
  isLoading: false,
  tableData: [],
  searchData: [],
  tableHeadList: []
}

// getters
const getters = {}

// actions
const actions = {
  // 获取搜索数据
  getSearchData: async ({commit}) => {
    let data = await $get(`${api.customChartView}/${state.currentRow.id}/metadata`)
    commit('updateSearchData', data.search_items)
  },
  // 获取列表数据
  getTableData: async ({commit, state}) => {
    commit('updateLoading', true);
    // 接口请求数据
    let params = {
      extra_params: {}
    }
    let condition = transfromForBackend(state.params.condition)
    let _condition = filterOutType(condition)
    state.condition = _condition.condition
    params.condition = _condition.condition
    if (state.pager) {
      params.extra_params.pager = state.pager
    }
    // 用于按条件导出
    state.extraCondition = {
      chart_id: state.currentRow.id
    }
    let data = await $get(`${api.customChartView}/${state.currentRow.id}/data`, params);

    let chartData = data.chart_data
    commit('updateLoading', false);
    commit('updateTableData', state.tableData.concat(chartData.data));

    commit('updatePager', chartData.pager ? chartData.pager : '');
    let vlfName = `customChartDialogModule_${state.currentRow.id}`
    localforage.getItem(vlfName).then(val => {
      if (val) {
        commit('updateEditTableList', val.headers)
      } else {
        commit('updateEditTableList', chartData.list_header);
        commit('updateColumnFixed', false);
      }
    })
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
  updatePager(state, payload) {
    state.pager = payload
  },
  // 更新data数据
  updateTableData(state, payload) {
    state.tableData = payload
  },
  // 更新列表表头数据
  updateEditTableList(state, payload) {
    let headers = []
    if (payload.length > 0) {
      headers = payload.map(item => {
        return {
          label: item.label || item.display,
          prop: item.prop || item.key,
          checked: item.checked === 0 ? 0 : 1,
          width: item.width || 160
        }
      })
      headers[0].fixed = true
    }
    state.tableHeadList = headers
  },
  // 更新列表参数数据，清空用
  updateParams1(state, payload) {
    state.params = Object.assign({}, payload)
  },
  // 更新列表参数数据
  updateParams(state, payload) {
    state.params = Object.assign({}, state.params, payload)
  },
  // 更新当前查看的数据id
  updateCurrentRow(state, payload) {
    state.currentRow = payload
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
