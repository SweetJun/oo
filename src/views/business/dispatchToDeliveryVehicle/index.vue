<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/goodsCar/add"
      :selection="false"
      :table-operation="tableOperation">
    </nf-table-page>
    <!-- 交货 -->
    <nf-dialog
      title="交货"
      :dialog-visible.sync="dialogVisible"
      width="1000px"
      :disabled="vehicles.length === 0"
      saveBtnText="交货"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content" v-loading="loading">
        <order-base-info v-if="!loading" :isShowCount="false" state="dispatch_deliver_vehicle" :data="baseData"></order-base-info>
        <!-- 装车清单 -->
        <div class="block">
          <h4>交货清单：</h4>
          <el-table
            ref="vehicleTable2"
            :data="dialogTableData"
            row-key="id"
            border
            size="mini"
            max-height="240px"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" :selectable="selectable"></el-table-column>
            <el-table-column
              v-for="(column, index) in dialogTableColumns"
              :key="index"
              :label="column.label"
              :prop="column.prop"
              show-overflow-tooltip
              :min-width="column.width" >
            </el-table-column>
          </el-table>
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
    let _this = this
    return {
      storeModelName: 'dispatchToDeliveryVehicleModule',
      tableOperation: {
        width: 80,
        fixed: 'right',
        buttonGroups: [
          () => {
            return {
              name: '交货',
              isShow: _this.roles['dispatch_deliver_vehicle'],
              click: ({row})=> {
                this.deliveryVehicles(row)
              }
            }
          }
        ]
      },
      loading: false,
      dialogVisible: false,
      baseData: {}, // 基础数据展示
      dialogTableData: [],
      dialogTableColumns: [
        {label: '运单号', prop: 'order_display', width: 80},
        {label: '起运地', prop: 'from_display', width: 60},
        {label: '目的地', prop: 'to_display', width: 60},
        {label: '品牌/车型', prop: 'brand_display', width: 100},
        {label: '车架号', prop: 'vin', width: 80}
      ],
      vehicles: []
    }
  },
  computed: {
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    // 是否可选
    selectable(row) {
      return !row.loaded
    },
    // 获取调度单需要装车的数据
    getVehiclesToLoad(id) {
      let url = `${api.dispatch}/${id}/vehicles/to/deliver`
      this.loading = true
      $get(url).then(res => {
        this.loading = false
        this.baseData = {
          number: res.number,
          transport_type_display: res.transport_type_display,
          transport_unit_display: res.transport_unit_display,
          truck_driver_name: res.truck_driver_name,
          truck_driver_mobile: res.truck_driver_mobile,
          truck_tractor_number: res.truck_tractor_number,
          vehicle_count: res.vehicle_count,
          carry_type_display: res.dispatch_type_display,
          truck_assign_time_display: res.truck_assign_time_display
        }
        this.dialogTableData = res.vehicles.map(item => {
          return {
            id: item.id,
            order_display: item.order_number,
            from_display: item.from,
            to_display: item.to,
            brand_display: `${item.brand} / ${item.vehicle}`,
            vin: item.vin
          }
        })
      })
    },
    // 点击交货
    deliveryVehicles(row) {
      this.getVehiclesToLoad(row.id)
      this.currentRow = row
      this.dialogVisible = true
    },
    // 选择商品车
    handleSelectionChange(val) {
      this.vehicles = val.map(item => item.id)
    },
    // 点击确认交货
    clickSureBtn(loading) {
      loading(true)
      let url = `${api.dispatch}/${this.currentRow.id}/deliver/vehicles`
      $post(url, {vehicles: this.vehicles}).then(() =>{
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
