<template>
  <div>
    <div class="client_name">客户名称：{{clientName}}</div>
    <el-tabs v-model="lineType" @tab-click="lineTypeChange">
      <el-tab-pane :label="'结算线路[' + contract + ']'" name="contract"></el-tab-pane>
      <el-tab-pane :label="'暂估线路[' + estimate + ']'" name="estimate"></el-tab-pane>
    </el-tabs>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
      <div class="table-top-left" slot="top-btn-left" v-if="roles['client_rule_add']">
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddPrice">
          添加
        </el-button>
      </div>
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'clientRulePriceModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit,
              click: ({row}) => {
                let query = {
                  set_id: this.query.set_id,
                  id: row.id,
                  type: this.lineType
                }
                this.goNextPage('/clientrule/price/edit', query)
              }
            }
          },
          // 根据字段判断按钮的显示状态
          scope => {
            return {
              name: '删除',
              type: 'danger',
              isShow: scope.row.acl.can_delete,
              click: ({row})=> {
                let apiUrl = `${api.clientRule}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row, true)
              }
            }
          }
        ]
      },
      batchOptions: [
        {
          id: 0,
          role: 'client_rule_delete',
          label: '批量删除',
          url: api.clientRuleBatchDelete
        }
      ],
      lineType: 'contract',
      clientName: '',
      estimate: '', // 暂估路线
      contract: '' // 结算路线
    }
  },
  computed: {
    // 筛选出带slot插槽的数据
    tableHeadListSlotName() {
      return this.$store.state[this.storeModelName].tableHeadList.filter(item => item.slotName)
    },
    // 数据总数
    total() {
      return this.$store.state[this.storeModelName].total
    },
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    // 改变路线类型
    lineTypeChange(tab) {
      let params = this.$store.state[this.storeModelName].params
      if (params.type === tab.name) return
      let excessParams = {
        type: this.lineType
      }
      this.$store.commit(`${this.storeModelName}/updateParams`, excessParams)
      this.$store.dispatch('pageData/getTableData', this.storeModelName)
    },
    // 添加
    handleAddPrice() {
      this.$router.push({
        path: '/clientrule/price/add',
        query: {
          set_id: this.query.set_id,
          type: this.lineType
        }
      })
    }
  },
  created() {
    this.query = this.$route.query
    this.clientName = this.query.name
    this.lineType = this.query.type
    this.estimate = this.query.estimate
    this.contract = this.query.contract
    let params = {
      set_id: this.query.set_id,
      type: this.query.type,
      client_rule_expire: this.query.expire
    }
    this.$store.commit(`${this.storeModelName}/updateParams`, params)
  },
  watch: {
    total(newValue) {
      if (this.lineType === 'contract') {
        this.contract = newValue
      } else {
        this.estimate = newValue
      }
      let query = _.cloneDeep(this.query)
      let newParams = {
        contract: this.contract,
        estimate: this.estimate,
        type: this.lineType
      }
      Object.assign(query, newParams)
      this.$router.replace({ query: query }).catch(() =>{})
    }
  }
}
</script>

<style lang="scss" scoped>
  .client_name{
    font-size: 24px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .el-tabs /deep/{
    .el-tabs__item{
      font-size: 24px;
      font-weight: 400;
    }
  }
</style>
