<template>
  <div>
    <nf-dialog
      title="选择运力"
      :dialog-visible.sync="dialogTruck"
      width="800px"
      :disabled="selectData.length === 0 || !selectData.id"
      @close="dialogClose"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <div class="content-header">
          <el-input
            placeholder="输入驾驶员姓名/手机号/车牌号搜索"
            clearable
            prefix-icon="el-icon-search"
            @input="inputChange"
            v-model="keyWorld">
          </el-input>
          <el-button type="primary" @click="addTruckClick" v-if="roles['truck_add']">添加运力</el-button>
        </div>
        <nf-infinite-scroll
          target=".el-table__body-wrapper"
          :infinite-scroll="scrollToBottom">
          <template slot="content">
            <el-table
              ref="truckTable"
              :data="tableData"
              size="small"
              border
              min-height="300"
              max-height="500"
              v-loading="loading"
              @select="selectChange">
              <el-table-column label="驾驶员姓名" prop="driver_name" min-width="80"></el-table-column>
              <el-table-column label="手机号" prop="mobile_phone" min-width="80"></el-table-column>
              <el-table-column label="车牌号" prop="tractor_number" min-width="80"></el-table-column>
              <el-table-column label="状态" prop="state_name" min-width="80"></el-table-column>
              <el-table-column label="操作" type="selection" width="50">
                <template slot="header">
                  操作
                </template>
              </el-table-column>
              <div slot="append" class="append-last-row" v-if="!loading">
                {{loadingTxt}}
              </div>
            </el-table>
          </template>
        </nf-infinite-scroll>
      </div>
    </nf-dialog>
    <!-- 添加运力 -->
    <nf-quick-truck
      :dialogAddTruck.sync="dialogAddTruck"
      :truck-type="truckType"
      @success="addSuccess">
    </nf-quick-truck>
  </div>
</template>

<script>
/**
 * @Description: 选择运力
 * @Author: wjw
 * @Date: 2020-04-14 17:18:33
 */
import { debounce } from 'throttle-debounce'
export default {
  name: 'nfSelectTruck',
  props: {
    dialogTruck: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 运力类型
    truckType: {
      type: String,
      default: 'own'
    },
    // 当合同外协时，需要承运方id
    transportUnit: {
      type: [String, Number],
      default: ''
    },
    // 选中的数据
    selectData: {
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {
      privileges: [
        'truck_add'
      ],
      roles: {
        truck_add: false
      },
      loading: false,
      dialogAddTruck: false,
      loadingTxt: '',
      keyWorld: '',
      apiUrl: '',
      params: {
        page: 1,
        per_page: 20
      },
      tableData: []
    }
  },
  methods: {
    // 添加运力
    addTruckClick() {
      this.dialogAddTruck = true
    },
    // 获取表格数据
    getTableData() {
      this.loading = true
      let params = {
        pager: {
          page: this.params.page,
          per_page: this.params.per_page
        },
        keyword: this.keyWorld,
        partner_id: this.transportUnit
      }
      let selectData = []
      $get(this.apiUrl, params).then((res) => {
        this.tableData = this.tableData.concat(res.data)
        this.loading = false
        if (res.data.length === 20) {
          this.canLoad = true
          this.loadingTxt = ''
        } else if (this.tableData.length === 0) {
          this.canLoad = false
          this.loadingTxt = ''
        } else {
          this.canLoad = false
          this.loadingTxt = '已加载全部'
        }

        if (this.multiple) {
          selectData = this.selectData
        } else {
          selectData = this.selectData.id ? [this.selectData] : []
        }
        // 显示默认勾选数据
        this.$nextTick(() => {
          selectData.forEach(checkItem => {
            this.tableData.forEach(dataItem => {
              if (checkItem.id === dataItem.id) {
                this.$refs['truckTable'].toggleRowSelection(dataItem, true)
                return
              }
            })
          })
        })
      })
    },
    // 搜索
    inputChange() {
      this.params.page = 1
      this.debounceSearch()
    },
    searchTruck() {
      this.tableData = []
      this.getTableData()
    },
    // 选择运力
    selectChange(selection, row) {
      if (this.multiple) {
        this.selectData = selection
      } else {
        this.$refs['truckTable'].clearSelection()
        this.$refs['truckTable'].toggleRowSelection(row)
        this.selectData = row
      }
    },
    // 确认选择
    clickSureBtn() {
      this.dialogTruck = false
      this.$emit('update:dialogTruck', false)
      this.$emit('select-change', this.selectData)
    },
    // 滚动到底部加载数据
    scrollToBottom() {
      if (!this.canLoad || this.loading) return
      this.params.page++
      this.getTableData()
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogTruck = false
      this.$emit('update:dialogTruck', false)
    },
    // 权限检测
    getPrivileges() {
      this.checkPrivileges(this.privileges).then(res => {
        this.roles = res ? res : {}
      })
    },
    // 快捷添加运力成功
    addSuccess() {
      this.inputChange()
    }
  },
  created() {
    if (this.truckType === 'own') {
      this.apiUrl = api.truckOwnSearchByKeyword
    } else if (this.truckType === 'personal') {
      this.apiUrl = api.truckPersonalSearchByKeyword
    } else {
      this.apiUrl = api.truckContractSearchByKeyword
    }
    this.getPrivileges()
    this.getTableData()
    this.debounceSearch = debounce(300, this.searchTruck)
  }
}
</script>

<style lang="scss" scoped>
  .content-header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .el-button{
      margin-left: 20px;
    }
  }
  .el-table /deep/ thead{
    th:nth-child(5){
      .cell{
        width: 50px;
        .el-checkbox{
          display: none;
        }
        &::after{
          content: '操作';
        }
      }
    }
  }
</style>
