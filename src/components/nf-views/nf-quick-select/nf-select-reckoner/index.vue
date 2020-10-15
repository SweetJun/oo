<template>
  <div>
    <nf-dialog
      title="选择结算人"
      :dialog-visible.sync="dialogReckoner"
      width="800px"
      :disabled="multiple ? selectData.length === 0 : !selectData.id"
      @close="dialogClose"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <div class="content-header">
          <el-input
            placeholder="输入姓名检索"
            clearable
            prefix-icon="el-icon-search"
            @input="inputChange"
            v-model="keyword">
          </el-input>
        </div>
        <nf-infinite-scroll
          target=".el-table__body-wrapper"
          :infinite-scroll="scrollToBottom">
          <template slot="content">
            <el-table
              ref="reckonerTable"
              :data="tableData"
              size="small"
              border
              min-height="300"
              max-height="500"
              v-loading="loading"
              @select="selectChange">
              <el-table-column label="名称" prop="name" min-width="70"></el-table-column>
              <el-table-column label="开户行" prop="bank_display" min-width="100"></el-table-column>
              <el-table-column label="支行名称" prop="bank_branch_name" min-width="100"></el-table-column>
              <el-table-column label="开户行卡号" prop="bank_card" min-width="100"></el-table-column>
              <el-table-column label="操作" type="selection" :selectable="expenseItemSelectable" width="45">
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
 * @Description: 选择/关联结算人
 * @Author: wjw
 * @Date: 2020-04-27 10:18:33
 */
import { debounce } from 'throttle-debounce'
export default {
  name: 'nfSelectReckoner',
  props: {
    dialogReckoner: {
      type: Boolean,
      default: false
    },
    // 关联类型 truck_personal 个人运力 driver驾驶员
    type: {
      type: String,
      default: ''
    },
    // 是用于关联还是选择已关联
    beRelated: {
      type: Boolean,
      default: false
    },
    truckId: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: [String, Number],
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 选中的数据，单选
    selectData: {
      type: [Object, Array],
      default: () => {
        return {id: ''}
      }
    }
  },
  data() {
    return {
      loading: false,
      loadingTxt: '',
      keyword: '',
      params: {
        page: 1,
        per_page: 20
      },
      tableData: []
    }
  },
  methods: {
    // 是否可选
    expenseItemSelectable(row) {
      return !row.is_selected
    },
    // 获取表格数据
    getTableData() {
      this.loading = true
      let params = {
        pager: {
          page: this.params.page,
          per_page: this.params.per_page
        },
        keyword: this.keyword
      }
      if (this.type) {
        params.type = this.type
      }
      if (this.id) {
        params.entity_id = this.id
      }
      let apiUrl = ''
      if (this.beRelated) {
        apiUrl = `${api.truckSettlementAccount}/${this.truckId}`
      } else {
        apiUrl = api.settlementAccountSearchByKeyword
      }
      let selectData = []
      $get(apiUrl, params).then((res) => {
        let result = res.data

        // 判断是否可选
        if (this.multiple) {
          selectData = this.selectData
        } else {
          selectData = this.selectData.id ? [this.selectData] : []
        }
        result.forEach(t => {
          let itemIndex = selectData.findIndex(item => t.id === item.id)
          if (itemIndex > -1) {
            t.is_selected = true
          } else {
            t.is_selected = false
          }
        })
        result.forEach(item => {
          item.bank_cards.forEach(bankcard => {
            if (bankcard.default) {
              this.$set(item, 'bank_display', bankcard.bank_display)
              this.$set(item, 'bank_branch_name', bankcard.bank_branch_name)
              this.$set(item, 'bank_card', bankcard.bank_display)
            }
          })
        })
        this.tableData = this.tableData.concat(result)
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
        // // 显示默认勾选数据
        // if (this.selectData.id) {
        //   this.$nextTick(() => {
        //     this.tableData.forEach(dataItem => {
        //       if (this.selectData.id === dataItem.id) {
        //         this.$refs['reckonerTable'].toggleRowSelection(dataItem, true)
        //         return
        //       }
        //     })
        //   })
        // }
      })
    },
    // 搜索
    inputChange() {
      this.params.page = 1
      this.debounceSearch()
    },
    searchData() {
      this.tableData = []
      this.getTableData()
    },
    // 选择运力，单选
    selectChange(selection, row) {
      if (this.multiple) {
        this.selectData = selection
      } else {
        this.$refs['reckonerTable'].clearSelection()
        this.$refs['reckonerTable'].toggleRowSelection(row)
        this.selectData = row
      }
    },
    // 确认选择
    clickSureBtn() {
      this.$emit('select-change', this.selectData)
      this.dialogClose()
    },
    // 滚动到底部加载数据
    scrollToBottom() {
      if (!this.canLoad || this.loading) return
      this.params.page++
      this.getTableData()
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogReckoner = false
      this.$emit('update:dialogReckoner', false)
    }
  },
  watch: {
    dialogReckoner(val) {
      if (!val) return
      this.params = {
        page: 1,
        per_page: 20
      }
      this.tableData = []
      this.getTableData()
      this.debounceSearch = debounce(300, this.searchData)
    }
  }
}
</script>

<style lang="scss" scoped>
  .content-header{
    margin-bottom: 20px;
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
