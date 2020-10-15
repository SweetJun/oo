<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :table-operation="tableOperation">
      <div class="table-top-left" slot="top-btn-left" v-if="roles['truck_oil_cost_set']">
        <el-button
          size="medium"
          type="primary"
          :disabled="multipleSelection.length === 0"
          @click="handleBatchSetting">
          批量设置
        </el-button>
      </div>
    </nf-table-page>
    <!-- 配板/上车 -->
    <nf-dialog
      :title="dialogTitle"
      :dialog-visible.sync="dialogVisible"
      width="400px"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-alert
          type="warning"
          :closable="false"
          :description="description"
          show-icon>
        </el-alert>
        <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-position="top">
          <el-form-item label="重驶百公里油耗：" prop="heavy_oil_cost">
            <el-input v-model="dialogForm.heavy_oil_cost" placeholder="请输入车辆百公里油耗"></el-input>
          </el-form-item>
          <el-form-item label="空驶百公里油耗：" prop="empty_oil_cost">
            <el-input v-model="dialogForm.empty_oil_cost" placeholder="请输入车辆百公里油耗"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'oilCostModule',
      dialogVisible: false,
      dialogTitle: '设置油耗',
      description: '',
      dialogForm: {
        heavy_oil_cost: '',
        empty_oil_cost: ''
      },
      dialogRules: {
        heavy_oil_cost: [
          { required: true, validator: this.$valid.isFloatNumber(true, '请输入重驶百公里油耗'), trigger: 'blur' }
        ],
        empty_oil_cost: [
          { required: true, validator: this.$valid.isFloatNumber(true, '请输入空驶百公里油耗'), trigger: 'blur' }
        ]
      },
      tableOperation: {
        width: 105,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '设置油耗',
              isShow: scope.row.acl.can_edit,
              click: ({row})=> {
                this.oilSetting(row)
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    // 多选的数据
    multipleSelection() {
      return this.$store.state[this.storeModelName].multipleSelection
    },
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    // 设置油耗
    oilSetting(row) {
      this.dialogVisible = true
      this.dialogTitle = '设置油耗'
      this.description = `设置【${row.tractor_number}-${row.trailer_number}】的油耗`
      this.currentRow = row
      this.$nextTick(() => {
        this.$refs['dialogForm'].resetFields()
      })
    },
    // 批量设置油耗
    handleBatchSetting() {
      this.dialogVisible = true
      this.dialogTitle = '批量设置油耗'
      this.description = `批量设置 ${this.multipleSelection.length} 个运力的油耗`
      this.$nextTick(() => {
        this.$refs['dialogForm'].resetFields()
      })
    },
    // 弹框点击确认
    clickSureBtn(loading) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          loading(true)
          let apiUrl, params = {};
          if (this.dialogTitle === '设置油耗') {
            apiUrl = `${api.oilCost}/${this.currentRow.id}`
            params = {
              heavy_oil_cost: this.dialogForm.heavy_oil_cost,
              empty_oil_cost: this.dialogForm.empty_oil_cost
            }
            $put(apiUrl, params).then(() =>{
              loading(false)
              this.$message.success('操作成功')
              this.dialogVisible = false
              this.$refs['nfTable'].$refs['nf-el-table'].toggleRowSelection(this.currentRow, false);
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
              this.$store.commit(`${this.storeModelName}/updateSelection`, _.pull(this.multipleSelection, this.currentRow.id))
            }).catch(() => {
              loading(false)
            })
          } else {
            apiUrl = api.oilCostBatchSet
            params = {
              heavy_oil_cost: this.dialogForm.heavy_oil_cost,
              empty_oil_cost: this.dialogForm.empty_oil_cost,
              truck_ids: this.multipleSelection
            }
            $post(apiUrl, params).then(() =>{
              loading(false)
              this.$message.success('操作成功')
              this.dialogVisible = false
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
              this.$refs['nfTable'].$refs['nf-el-table'].clearSelection()
              this.$store.commit(`${this.storeModelName}/updateSelection`, [])
            }).catch(() => {
              loading(false)
            })
          }
        } else {
          return false;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-alert /deep/{
    .el-alert__icon{
      width: 22px;
      font-size: 20px;
    }
    .el-alert__description{
      font-size: 13px;
      margin-top: 0
    }
  }
</style>
