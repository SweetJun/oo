<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/truck/ownTruck/add"
      :selectable="selectableFun"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
    </nf-table-page>
    <!-- 配板/上车 -->
    <nf-dialog
      :title="dialogTitle"
      :dialog-visible.sync="dialogVisible"
      width="400px"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-position="top">
          <el-form-item label="挂车车牌号：" prop="trailer_id" v-if="dialogTitle === '配板'">
             <el-select
              filterable
              v-model="dialogForm.trailer_id"
              remote
              :remote-method="remoteTrailerList"
              :loading="loading"
              placeholder="请选择挂车车牌号" >
              <el-option
                v-for="(item, index) in trailerList"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="驾驶员：" prop="driver_id" v-if="dialogTitle === '上车'">
             <el-select
              filterable
              v-model="dialogForm.driver_id"
              remote
              :remote-method="remoteDriverList"
              :loading="loading"
              placeholder="请选择驾驶员" >
              <el-option
                v-for="(item, index) in driverList"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
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
      storeModelName: 'ownTruckModule',
      loading: false,
      dialogVisible: false,
      dialogTitle: '配板',
      trailerList: [],
      driverList: [],
      dialogForm: {
        trailer_id: '',
        driver_id: ''
      },
      dialogRules: {
        trailer_id: [{ required: true, message: '请选择挂车车牌号', trigger: 'change' }],
        driver_id: [{ required: true, message: '请选择驾驶员', trigger: 'change' }]
      },
      tableOperation: {
        width: 155,
        fixed: 'right',
        buttonGroups: [
          // 根据字段判断按钮的显示状态
          scope => {
            return {
              name: '拆板',
              isShow: scope.row.acl.can_cancel_trailer,
              click: ({row})=> {
                this.pullDownBoard(row)
              }
            }
          },
          scope => {
            return {
              name: '配板',
              isShow: scope.row.acl.can_match_trailer,
              click: ({row})=> {
                this.matchingBoard(row)
              }
            }
          },
          scope => {
            return {
              name: '上车',
              isShow: scope.row.acl.can_match_driver,
              click: ({row})=> {
                this.getOnTheCar(row)
              }
            }
          },
          scope => {
            return {
              name: '下车',
              isShow: scope.row.acl.can_cancel_driver,
              click: ({row})=> {
                this.getOffTheCar(row)
              }
            }
          },
          scope => {
            return {
              name: '删除',
              type: 'danger',
              isShow: scope.row.acl.can_delete,
              click: ({row})=> {
                let apiUrl = `${api.truckOwn}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row, true)
              }
            }
          }
        ]
      },
      batchOptions: [
        {
          id: 0,
          role: 'truck_own_delete',
          label: '批量删除',
          url: api.truckOwnDelete
        },
        {
          id: 1,
          role: 'truck_own_cancel_trailer',
          label: '批量拆板',
          url: api.truckOwnBatchCancelTrailer
        },
        {
          id: 2,
          role: 'truck_own_cancel_driver',
          label: '批量下车',
          url: api.truckOwnBatchCancelDriver
        }
      ]
    }
  },
  methods: {
    // el-table  selectable 方法
    selectableFun(row) {
      let result = true
      let batchId = this.$refs.nfTable.batchVal.id
      switch(batchId) {
        case 0:
          result = row.acl.can_delete
          break
        case 1:
          result = row.acl.can_cancel_trailer
          break
        case 2:
          result = row.acl.can_cancel_driver
          break
      }
      return result
    },
    // 获取挂车车牌
    remoteTrailerList(query) {
      if (query.trim() !== '') {
        this.loading = true
        let url = `${api.searchItemAutocomplete}/trailer_number`
        $get(url, { keyword: query}).then(res => {
          this.loading = false
          this.trailerList = res
        })
      } else {
        this.trailerList = []
      }
    },
    // 获取驾驶员
    remoteDriverList(query) {
      if (query.trim() !== '') {
        this.loading = true
        let url = `${api.searchItemAutocomplete}/driver_own_name_or_mobile`
        $get(url, { keyword: query}).then(res => {
          this.loading = false
          this.driverList = res
        })
      } else {
        this.driverList = []
      }
    },
    // 拆板
    pullDownBoard(row) {
      this.confirm(`【${row.trailer_number}】将与【${row.tractor_number}】脱离`, '拆板确认').then(() => {
        $post(api.truckOwnCancelTrailer, {id: row.id}).then(() => {
          this.$message.success('操作成功')
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
        })
      }).catch(() => {})
    },
    // 下车
    getOffTheCar(row) {
      this.confirm(`【${row.driver_name}】将与【${row.tractor_number}】解除绑定`, '下车确认').then(() => {
        $post(api.truckOwnCancelDriver, {id: row.id}).then(() => {
          this.$message.success('操作成功')
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
        })
      }).catch(() => {})
    },
    // 配板
    matchingBoard(row) {
      this.dialogVisible = true
      this.dialogTitle = '配板'
      this.rowId = row.id
      this.$nextTick(() => {
        this.$refs['dialogForm'].resetFields()
      })
    },
    // 上车
    getOnTheCar(row) {
      this.dialogVisible = true
      this.dialogTitle = '上车'
      this.rowId = row.id
      this.$nextTick(() => {
        this.$refs['dialogForm'].resetFields()
      })
    },
    // 弹框点击确认
    clickSureBtn(loading) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          let apiUrl, params = {}
          if (this.dialogTitle === '配板') {
            apiUrl = api.truckOwnMatchTrailer
            params = {
              id: this.rowId,
              trailer_id: this.dialogForm.trailer_id
            }
          } else {
            apiUrl = api.truckOwnMatchDriver
            params = {
              id: this.rowId,
              driver_id: this.dialogForm.driver_id
            }
          }
          loading(true)
          $post(apiUrl, params).then(() =>{
            loading(false)
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$store.dispatch('pageData/getTableData', this.storeModelName)
          }).catch(() => {
            loading(false)
          })
        } else {
          return false;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item{
    .el-select{
      width: 100%;
    }
  }
</style>
