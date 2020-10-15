<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      search-label-width="80px"
      :store-model-name="storeModelName"
      :index="true"
      add-btn-link="/goodsCar/add"
      :privileges="privileges"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
      <!-- 根据tableHeadList slotName字端 动态插入 插槽 -->
      <template
        v-for="(item) in tableHeadListSlotName"
        :slot="item.slotName"
        slot-scope="{row}">
        <div :key="item.slotName" v-if="row">
          <span v-if="item.prop === 'image'" v-viewer>
            <img
              v-if="row.mc_id > 0 || row.image > 0"
              :src="row.mc_id > 0 || row.image > 0 ? '/api/vehicle/' + row.id + '/image?' + row.update_time : ''"
            alt="">
            <span v-else> - </span>
          </span>
          <span v-else>{{row[item.prop]}}</span>
        </div>
      </template>
      <div class="table-top-left" slot="top-btn-left">
        <el-button
          size="medium"
          type="primary"
          plain
          @click="handleToBrand">
          品牌管理
        </el-button>
        <el-button
          size="medium"
          type="primary"
          plain
          @click="handleVehicleCode">
          车型代码
        </el-button>
      </div>
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'goodsCarModule',
      tableOperation: {
        width: 180,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit,
              click: ({row})=> {
                this.goNextPage('/goodsCar/edit', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: '车型代码',
              type: 'warning',
              isShow: scope.row.acl.can_code_add,
              click: ({row})=> {
                this.handleVehicleCode(row)
              }
            }
          },
          scope => {
            return {
              name: '删除',
              type: 'danger',
              isShow: scope.row.acl.can_delete,
              click: ({row})=> {
                let apiUrl = `${api.vehicle}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row, true)
              }
            }
          }
        ]
      },
      batchOptions: [
        {
          id: 0,
          role: 'vehicle_delete',
          label: '批量删除',
          url: api.vehicleBatchDelete
        }
      ]
    }
  },
  computed: {
    // 找出带插槽的数据Item, 没有不用写（以及slot）
    tableHeadListSlotName() {
      return this.$store.state[this.storeModelName].tableHeadList.filter(item => item.slotName)
    }
  },
  methods: {
    // 品牌管理
    handleToBrand() {
      this.$router.push('/goodsCar/brand')
    },
    // 车型代码
    handleVehicleCode(row) {
      this.$router.push({
        path: '/goodsCar/vehicleCode',
        query: {
          search: JSON.stringify({key: row.id, value: row.name})
        }
      })
    }
  }
}
</script>
