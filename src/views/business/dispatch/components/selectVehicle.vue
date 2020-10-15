<template>
   <nf-dialog
    title="选择商品车"
    :dialog-visible.sync="dialogVehicle"
    width="1000px"
    @close="dialogClose"
    :click-sure-btn="clickSureBtn">
    <div class="nf-dialog-content" slot="content">
      <div class="diglog-top">
        <el-radio-group v-model="type" @change="lookTypeChange">
          <el-radio-button label="order">原运单</el-radio-button>
          <el-radio-button label="dealer">按相同经销商查看</el-radio-button>
          <el-radio-button label="to">按相同目的地查看</el-radio-button>
        </el-radio-group>
        <div class="search-box">
          <div class="search-item">
            <div class="content" v-if="type === 'order'">
              <span>运单号：</span>
              <el-input
                placeholder="请输入运单号"
                v-model="params.order_number_text"
                clearable>
              </el-input>
            </div>
            <div class="content" v-if="type === 'dealer'">
              <span>经销商名称：</span>
              <nf-select
                placeholder="请输入经销商名称"
                :options="[]"
                search-key="dealer_name"
                :value.sync="params.dealer">
              </nf-select>
            </div>
            <div class="content" v-if="type === 'to'">
              <span>目的地：</span>
              <nf-select
                placeholder="请输入目的地"
                :options="[]"
                search-key="region_to"
                :value.sync="params.to">
              </nf-select>
            </div>
            <el-button type="primary" icon="el-icon-search" @click="initTableData">查询</el-button>
          </div>
        </div>
      </div>
      <nf-infinite-scroll
        target=".el-table__body-wrapper"
        :infinite-scroll="scrollToBottom">
        <template slot="content">
          <el-table
            ref="vehicleTable"
            :data="tableData"
            row-key="id"
            border
            size="mini"
            max-height="350px"
            v-loading="loading"
            :tree-props="{children: 'vehicles', hasChildren: 'vehicles.length > 0'}">
            <el-table-column width="80" align="center" :render-header="renderHeader">
              <template slot-scope="{row}">
                <!-- 单个选择 -->
                <el-checkbox
                  :indeterminate="row.indeterminate && row.vehicles.length > 0"
                  v-model="row.checked"
                  :disabled="!row.transportable"
                  @change="rowSelect(row)">
                </el-checkbox>
                <!-- <el-tooltip v-else effect="dark" content="缺少上游规则，请联系系统管理员。" placement="right">
                  <el-checkbox
                    :indeterminate="row.indeterminate && row.vehicles.length > 0"
                    v-model="row.checked"
                    disabled>
                  </el-checkbox>
                </el-tooltip> -->
              </template>
            </el-table-column>
            <el-table-column
              v-for="(column, index) in activeColumns"
              :key="index"
              :label="column.label"
              show-overflow-tooltip
              :min-width="column.width" >
              <template slot-scope="{row}">
                <span v-if="column.prop === 'quantity'"> {{row['vehicles'] ? row['vehicles'].length : row['vin']}} </span>
                <!-- <span v-else-if="column.prop === 'number'">{{ row['number'] ?  }}</span> -->
                <span v-else>{{ row[column.prop] || '-' }}</span>
              </template>
            </el-table-column>
            <div slot="append" class="append-last-row" v-if="!loading">{{ loadingTxt }}</div>
          </el-table>
        </template>
      </nf-infinite-scroll>
      <div class="can-dispatch" v-if="ableSelectData.length > 0">
        <h3>以下是可以继续发运的商品车，请选择：</h3>
        <el-table
          ref="vehicleTable2"
          :data="ableSelectData"
          row-key="id"
          border
          size="mini"
          max-height="240px"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column
            v-for="(column, index) in activeColumns"
            :key="index"
            :label="column.label"
            :prop="column.prop"
            show-overflow-tooltip
            :min-width="column.width" >
            <template slot-scope="{row}">
              <span v-if="column.prop === 'quantity'">{{ row['vin'] }}</span>
              <span v-else>{{ row[column.prop] || '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="select">已选择 <span>{{selectData.length + ableSelected.length}}</span> 台商品车</div>
    </div>
  </nf-dialog>
</template>

<script>
// 添加商品车
import checked from '../mixins'
export default {
  mixins: [checked],
  props: {
    dialogVehicle: {
      type: Boolean,
      default: false
    },
    // 默认勾选的商品车
    selectData: {
      type: Array,
      default: () => []
    },
    // 可继续发运的商品车
    ableSelectData: {
      type: Array,
      default: () => []
    },
    // 用于区分是否获取推荐路线凋零列表
    // 当点击调令列表的item添加商品车时不获取
    itemClick: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: 'order',
      loading: false,
      isCheckAll: false,
      indeterminate: false,
      loadingTxt: '',
      params: {
        page: 1,
        per_page: 20,
        order_number_text: '',
        dealer: '',
        to: ''
      },
      tableData: [],
      ableSelected: [],
      activeColumns: [
        {
          label: '运单号',
          prop: 'number',
          width: 100
        },
        {
          label: '起运地',
          prop: 'from_display',
          width: 100
        },
        {
          label: '目的地',
          prop: 'to_display',
          width: 100
        },
        {
          label: '台数',
          prop: 'quantity',
          width: 80
        },
        {
          label: '所属办事处',
          prop: 'agency_display',
          width: 100
        },
        {
          label: '下单时间',
          prop: 'place_time_display',
          width: 120
        }
      ]
    }
  },
  methods: {
    // 自定义表头（使用solt，当点击check后，值变化，但是状态没变）
    renderHeader(h) {
      return h("span", {}, [
        h('el-checkbox', {
          props: {
            checked: this.isCheckAll,
            indeterminate: this.indeterminate || this.selectData.length > 0
          },
          on: {
            change: this.selectAll // 选中事件
          }
        })]);
    },
    // 获取表格数据
    getTableData() {
      this.loading = true
      let params = {
        pager: {
          page: this.params.page,
          per_page: this.params.per_page
        },
        condition: {},
        mode: this.type
      }
      if (this.type === 'order' && this.params['order_number_text']) {
        params.condition.order_number_text = this.params['order_number_text']
      } else if (this.type === 'dealer' && this.params['dealer']) {
        params.condition.dealer = this.params['dealer']
      } else if (this.type === 'to' && this.params['to']) {
        params.condition.to = this.params['to']
      }
      if (this.$route.query.id) {
        params.condition.dispatch = this.$route.query.id
      }
      $get(api.orderVehiclesToTransport, params).then((res) => {
        let result = res.data
        this.loading = false
        if (result.length === 20) {
          this.canLoad = true
          this.loadingTxt = ''
        } else if (result.length === 0) {
          this.canLoad = false
          this.loadingTxt = ''
        } else {
          this.canLoad = false
          this.loadingTxt = '已加载全部'
        }
        result.map(item => {
          if (item.vehicles) {
            if (this.type === 'dealer' || this.type === 'to') {
              this.$set(item, 'from_display', '')
              this.$set(item, 'to_display', '')
            }
            item.vehicles.forEach(vehicle => {
              this.$set(vehicle, 'number', item.number)
              this.$set(vehicle, 'agency_display', item.agency_display || '')
              this.$set(vehicle, 'place_time_display', item.place_time_display || '')
              this.$set(vehicle, 'dealer_display', item.dealer_display || '')
              vehicle.id = `${vehicle.id}_${vehicle.id}`
              if (this.type === 'dealer') {
                item.from_display += vehicle.from_display + '，'
                item.to_display += vehicle.to_display + '，'
                // 去重
                item.from_display = _.uniq(item.from_display.split('，')).join('，')
                item.to_display = _.uniq(item.to_display.split('，')).join('，')
              }
              if (this.type === 'to') {
                item.from_display += vehicle.from_display + '，'
                item.to_display += vehicle.to_display + '，'
                // 去重
                item.from_display = _.uniq(item.from_display.split('，')).join('，')
                item.to_display = _.uniq(item.to_display.split('，')).join('，')
              }
            })
            switch (this.type) {
              case 'order':
                item.id = item.order
                break
              case 'dealer':
                item.id = item.dealer
                // 截掉最后一个逗号
                item.from_display = item.from_display.substr(0, item.from_display.length - 1)
                item.to_display = item.to_display.substr(0, item.to_display.length - 1)
                break
              case 'to':
                item.id = item.to
                item.to_display = item.to_display.substr(0, item.to_display.length - 1)
                item.from_display = item.from_display.substr(0, item.from_display.length - 1)
                break
            }
          }
          return item
        })
        this.tableData = this.tableData.concat(result)
        // 初始化 checked为false
        this.tableData.forEach(item => {
          this.recursiveCheck(item, false)
        })
        // 设置默认勾选项
        this.$nextTick(() => {
          this.selectData.forEach(item => {
            this.tableData.forEach(data => {
              if (data.vehicles) {
                data.vehicles.forEach(vehicle => {
                  if (vehicle.id === item.id) {
                    vehicle.checked = true
                    this.toggleParentByChild(data.id)
                  }
                })
              }
            })
          })
          this.toggleTableHeaderCheck()
        })
        this.getAbleDataColumnLable()
      })
    },
    // 查看方式
    lookTypeChange() {
      this.tableData = []
      switch(this.type) {
        case 'order':
          this.activeColumns = [
            {
              label: '运单号',
              prop: 'number',
              width: 100
            },
            {
              label: '起运地',
              prop: 'from_display',
              width: 100
            },
            {
              label: '目的地',
              prop: 'to_display',
              width: 100
            },
            {
              label: '台数',
              prop: 'quantity',
              width: 80
            },
            {
              label: '所属办事处',
              prop: 'agency_display',
              width: 100
            },
            {
              label: '下单时间',
              prop: 'place_time_display',
              width: 120
            }
          ]
          break
        case 'dealer':
          this.activeColumns = [
            {
              label: '经销商名称',
              prop: 'dealer_display',
              width: 100
            },
            {
              label: '出发地',
              prop: 'from_display',
              width: 100
            },
            {
              label: '目的地',
              prop: 'to_display',
              width: 100
            },
            {
              label: '台数',
              prop: 'quantity',
              width: 60
            }
          ]
          break
        case 'to':
          this.activeColumns = [
            {
              label: '目的地',
              prop: 'to_display',
              width: 100
            },
            {
              label: '出发地',
              prop: 'from_display',
              width: 100
            },
            {
              label: '经销商名称',
              prop: 'dealer_display',
              width: 100
            },
            {
              label: '台数',
              prop: 'quantity',
              width: 60
            }
          ]
          break
      }
      this.initTableData()
    },
    // 初始化表格数据
    initTableData() {
      this.params.page = 1
      this.tableData = []
      this.getTableData()
    },
    // 复选框事件
    // 表头点击全选或全不选
    selectAll() {
      this.isCheckAll = !this.isCheckAll
      // 切换表头check状态
      this.indeterminate = false

      this.toggleCheckedStatus(this.tableData, this.isCheckAll)
      this.getAllChildrenChecked()
    },
    // 点击某一行check-box
    rowSelect(row) {
      // 如果点击的父级，就处理所有子级勾选状态
      if (row.vehicles) {
        row.indeterminate = false //子级肯定全选或者全不选
        this.toggleCheckedStatus(row.vehicles, row.checked);
      } else {
        this.toggleParentByChild(row.id)
      }
      this.toggleTableHeaderCheck()
      this.getAllChildrenChecked()
    },
    // 获取所有被选的子级项（父级信息不需要）
    getAllChildrenChecked() {
      this.selectData = []
      this.tableData.forEach(item => {
        if (item.vehicles) {
          item.vehicles.forEach(vehicle => {
            if (vehicle.checked) {
              this.selectData.push(vehicle)
            }
          })
        }
      })
    },
    // 点击确定
    clickSureBtn() {
      this.$emit('update:dialogVehicle', false)
      let params = {
        data: this.selectData,
        ableData: this.ableSelected,
        itemClick: this.itemClick
      }
      this.$emit('select-data', params)
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogVehicle = false
      this.$emit('update:dialogVehicle', false)
    },
    // 滚动到底部加载数据
    scrollToBottom() {
      if (!this.canLoad || this.loading) return
      this.params.page++
      this.getTableData()
    },
    // ableSelectData和表格数据匹配，找出列显示字段
    getAbleDataColumnLable() {
      this.ableSelectData.forEach(able => {
        this.tableData.forEach(item => {
          if (item.vehicles) {
            item.vehicles.forEach(vehicle => {
              if (able.id === vehicle.id) {
                if (this.type === 'order') {
                  this.$set(able, 'number', item.number)
                  this.$set(able, 'agency_display', item.agency_display)
                  this.$set(able, 'place_time_display', item.place_time_display)
                } else if (this.type === 'dealer') {
                  this.$set(able, 'dealer_display', item.dealer_display)
                }
                return
              }
            })
          }
        })
      })
    },
    handleSelectionChange(val) {
      this.ableSelected = val
    }
  },
  created() {
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper /deep/{
    .el-dialog{
      margin-top: 8vh !important;
    }
    .el-dialog__body{
      padding: 10px 20px;
    }
  }
  .search-box{
    display: inline-block;
  }
  .search-item{
    .content{
      display: inline-block;
      margin-left: 40px;
    }
    .el-input, .nf-select{
      width: 220px;
    }
    .el-button{
      margin-left: 10px;
    }
  }
  .diglog-top{
    margin-bottom: 20px;
  }
  .select{
    position: absolute;
    bottom: 25px;
    left: 20px;
    span{
      color: $themeColor;
      font-size: 16px;
    }
  }
</style>
