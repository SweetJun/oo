<template>
  <div>
    <nf-dialog
      title="选择调度单"
      :dialog-visible.sync="dialogSelectDispatch"
      width="800px"
      :disabled="selectData.length === 0 || !selectData.id"
      @close="dialogClose"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <div class="content-header">
          <div>
            起运地：
            <nf-select
              placeholder="请输入起运地"
              value-key="key"
              search-key="region_from"
              :value.sync="params.region_from">
            </nf-select>
          </div>
          <div>
            起运地：
            <nf-select
              placeholder="请输入目的地"
              value-key="key"
              search-key="region_to"
              :value.sync="params.region_to">
            </nf-select>
          </div>
          <el-button type="primary" icon="el-icon-search" @click="searchClick">查询</el-button>
        </div>
        <nf-infinite-scroll
          target=".el-table__body-wrapper"
          :infinite-scroll="scrollToBottom">
          <template slot="content">
            <el-table
              ref="dispatchTable"
              :data="tableData"
              size="mini"
              border
              min-height="300"
              max-height="500"
              v-loading="loading"
              @select="selectChange">
              <el-table-column label="调度单号" prop="number" min-width="100"></el-table-column>
              <el-table-column label="出发地" prop="from_display" min-width="80"></el-table-column>
              <el-table-column label="目的地" prop="to_display" min-width="80"></el-table-column>
              <el-table-column label="创建时间" prop="create_time_display" min-width="100"></el-table-column>
              <el-table-column label="操作" type="selection" width="45">
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
  </div>
</template>

<script>
/**
 * @Description: 选择调度单
 * @Author: wjw
 * @Date: 2020-04-14 17:18:33
 */
export default {
  name: 'nfSelectDispatch',
  props: {
    dialogSelectDispatch: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 选中的数据
    selectData: {
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      loadingTxt: '',
      apiUrl: '',
      params: {
        page: 1,
        per_page: 20,
        region_from: '',
        region_to: ''
      },
      tableData: []
    }
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.loading = true
      let params = {
        pager: {
          page: this.params.page,
          per_page: this.params.per_page
        },
        condition: {
          region_from: this.params.region_from,
          region_to: this.params.region_to
        }
      }
      let selectData = []
      $get(api.dispatches, params).then((res) => {
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
                this.$refs['dispatchTable'].toggleRowSelection(dataItem, true)
                return
              }
            })
          })
        })
      })
    },
    // 搜索
    searchClick() {
      this.params.page = 1
      this.tableData = []
      this.getTableData()
    },
    // 选择调度单
    selectChange(selection, row) {
      if (this.multiple) {
        this.selectData = selection
      } else {
        this.$refs['dispatchTable'].clearSelection()
        this.$refs['dispatchTable'].toggleRowSelection(row)
        this.selectData = row
      }
    },
    // 确认选择
    clickSureBtn() {
      this.dialogClose()
      this.$emit('select-change', this.selectData)
    },
    // 滚动到底部加载数据
    scrollToBottom() {
      if (!this.canLoad) return
      this.params.page++
      this.getTableData()
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogSelectDispatch = false
      this.$emit('update:dialogSelectDispatch', false)
    }
  },
  watch: {
    dialogSelectDispatch(val) {
      if (!val) return
      this.params = {
        page: 1,
        per_page: 20,
        region_from: '',
        region_to: ''
      }
      this.tableData = []
      this.getTableData()
    }
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
