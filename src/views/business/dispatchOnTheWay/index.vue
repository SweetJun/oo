<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :table-operation="tableOperation">
    </nf-table-page>
    <!-- 已装车 -->
    <nf-dialog
      title="车辆到达"
      :dialog-visible.sync="dialogVisible"
      width="1000px"
      saveBtnText="车辆已到达"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content" v-loading="loading">
        <order-base-info v-if="!loading" :data="baseData"></order-base-info>
        <div class="block">
          <span>到达时间：</span>
          <!-- 日期选择 -->
          <el-date-picker
            class="search-item"
            v-model="complete_time"
            type="datetime"
            placeholder="请选择到达时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
import orderBaseInfo from '../components/orderBeseInfo'
export default {
  components: {
    orderBaseInfo
  },
  data() {
    return {
      storeModelName: 'dispatchOnTheWayModule',
      tableOperation: {
        width: 80,
        fixed: 'right',
        buttonGroups: [
          () => {
            return {
              name: '到达',
              isShow: this.roles['dispatch_command_complete'],
              click: ({row})=> {
                this.vehicleArrival(row)
              }
            }
          }
        ]
      },
      dialogVisible: false,
      loading: false,
      baseData: {}, // 基础数据展示
      complete_time: ''
    }
  },
  computed: {
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    // 获取调度单需要装车的数据
    getVehiclesDetail(id) {
      let url = `${api.dispatch}/${id}/command/to/complete`
      this.loading = true
      $get(url).then(res => {
        this.loading = false
        if (Array.isArray(res) && res.length === 0) {
          this.$message.warning('当前调令已完成')
          this.dialogVisible = false
          return
        }
        this.baseData = {
          number: res.number,
          transport_type_display: res.transport_type_display,
          transport_unit_display: res.transport_unit_display,
          from_display: res.from_display,
          to_display: res.to_display,
          mileage: res.mileage,
          truck_driver_name: res.truck_driver_name,
          truck_driver_mobile: res.truck_driver_mobile,
          truck_tractor_number: res.truck_tractor_number,
          vehicle_count: res.vehicle_count,
          carry_type_display: res.carry_type_display,
          truck_assign_time_display: res.truck_assign_time_display
        }
      })
    },
    // 点击车辆到达
    vehicleArrival(row) {
      this.dialogVisible = true
      this.getVehiclesDetail(row.id)
      this.currentRow = row
      this.complete_time = moment().format("YYYY-MM-DD HH:mm:ss")
    },
    // 确认车辆到达
    clickSureBtn(loading) {
      loading(true)
      let url = `${api.dispatch}/${this.currentRow.id}/complete/command`
      $post(url, {complete_time: this.complete_time}).then(() =>{
        loading(false)
        this.dialogVisible = false
        this.$message.success('操作成功')
        this.$store.dispatch('pageData/getTableData', this.storeModelName)
      }).catch(() => {
        loading(false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table--border/deep/{
    td:first-child .cell{
      padding-left: 14px;
    }
  }
  .block{
    margin-top: 20px;
  }
  .el-textarea{
    width: 60%;
  }
</style>
