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
      title="确认装车"
      :dialog-visible.sync="dialogVisible"
      width="1000px"
      :disabled="params.vehicles.length === 0"
      saveBtnText="装车"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content" v-loading="loading">
        <order-base-info v-if="!loading" :data="baseData"></order-base-info>
        <!-- 装车清单 -->
        <div class="block">
          <h4>装车清单：</h4>
          <el-table
            ref="vehicleTable2"
            :data="dialogTableData"
            row-key="id"
            border
            size="mini"
            max-height="200px"
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
        <div class="block">
          <h4>装车照片：</h4>
          <nf-upload
            :url="uploadUrl"
            :file-preview-list="fileList"
            :upload-success="handleFileSuccess"
            :file-remove="handleFileRemove">
          </nf-upload>
        </div>
        <div class="block">
          <h4>装车备注：</h4>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="params.note">
          </el-input>
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
      storeModelName: 'dispatchToLoadVehicleModule',
      tableOperation: {
        width: 80,
        fixed: 'right',
        buttonGroups: [
          () => {
            return {
              name: '装车',
              isShow: this.roles['dispatch_load_vehicle'],
              click: ({row})=> {
                this.loadedVehicles(row)
              }
            }
          }
        ]
      },
      uploadUrl: api.fileUpload,
      dialogVisible: false,
      loading: false,
      baseData: {}, // 基础数据展示
      dialogTableData: [],
      fileList: [],
      dialogTableColumns: [
        {label: '运单号', prop: 'order_display', width: 80},
        {label: '起运地', prop: 'from_display', width: 60},
        {label: '目的地', prop: 'to_display', width: 60},
        {label: '品牌/车型', prop: 'brand_display', width: 100},
        {label: '车架号', prop: 'vin', width: 80}
      ],
      params: {
        vehicles: [],
        images: [],
        note: ''
      }
    }
  },
  computed: {
    // 找出带插槽的数据Item, 没有不用写（以及slot）
    tableHeadListSlotName() {
      return this.$store.state[this.storeModelName].tableHeadList.filter(item => item.slotName)
    },
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
      let url = `${api.dispatch}/${id}/vehicles/to/load`
      this.loading = true
      $get(url).then(res => {
        this.loading = false
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
        this.dialogTableData = res.vehicles.map(item => {
          return {
            id: item.order_vehicle,
            order_display: item.order_display,
            from_display: item.order_vehicle_display.from_display,
            to_display: item.order_vehicle_display.to_display,
            brand_display: `${item.order_vehicle_display.brand_display} / ${item.order_vehicle_display.vehicle_display}`,
            vin: item.order_vehicle_display.vin,
            loaded: item.loaded
          }
        })
      })
    },
    // 点击已装车
    loadedVehicles(row) {
      this.getVehiclesToLoad(row.id)
      this.currentRow = row
      this.dialogVisible = true
      this.fileList = []
    },
    // 选择商品车
    handleSelectionChange(val) {
      this.params.vehicles = val.map(item => item.id)
    },
    // 上传成功
    handleFileSuccess(response, file) {
      this.params.images.push(response.file);
      this.fileList.push(file.url)
    },
    // 移除照片
    handleFileRemove(id) {
      this.params.images = _.pull(this.formData.images, id)
    },
    // 点击确认装车
    clickSureBtn(loading) {
      loading(true)
      let url = `${api.dispatch}/${this.currentRow.id}/load/vehicles`
      $post(url, this.params).then(() =>{
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
