<template>
  <div>
    <!-- 添加费用 -->
    <nf-dialog
      class="nf-dialog"
      title="添加费用"
      :dialog-visible.sync="dialogExpenseItem"
      width="1000px"
      :disabled="selectExpenseItems.length === 0"
      @close="dialogClose"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content flex" slot="content">
        <div class="left">
          <span class="span-title">请选择费用</span>
          <el-input
            placeholder="搜索费用"
            clearable
            size="medium"
            prefix-icon="el-icon-search"
            @input="inputChange"
            v-model="keyWorld">
          </el-input>
          <el-table
            ref="expenseItemTable"
            class="expenseItemTable"
            :data="expenseItemData"
            max-height="460px"
            border
            size="mini"
            row-key="id"
            v-loading="loading"
            @select="handleSelectionChange"
            :show-header="false">
            <el-table-column prop="name" label="姓名" min-width="130"></el-table-column>
            <el-table-column type="selection" width="45" :selectable="expenseItemSelectable"/>
            <div slot="append" class="append-last-row" v-if="!loading">
              {{loadingTxt}}
            </div>
          </el-table>
        </div>
        <div class="right">
          <p class="span-title">已选择<span class="select-expense-number"> {{selectExpenseItems.length}} </span>个费用项</p>
          <div class="departments">
            <el-tag
              v-for="(item, index) in selectExpenseItems"
              :key="index"
              closable
              @close="handleClose(index)">
              {{item.name}}
            </el-tag>
          </div>
        </div>
      </div>
    </nf-dialog>
  </div>
</template>
<script>
import { debounce } from 'throttle-debounce'
export default {
  name: 'nfDialogExpense',
  props: {
    // store模块 名称
    storeModelName: {
      type: String,
      default: ''
    },
    dialogExpenseItem: {
      type: Boolean,
      default: false
    },
    // 已选过的不能选
    unExpenseItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      loadingTxt: '',
      keyWorld: '',
      params: {
        page: 1,
        per_page: 20
      },
      expenseItemData: [],
      selectExpenseItems: []
    }
  },
  methods: {
    // 是否可选
    expenseItemSelectable(row) {
      let index = _.findIndex(this.unExpenseItems, (item) => { return item.id === row.id })
      return index === -1
    },
    // 搜索费用项
    getExpenseItems() {
      let params = {
        pager: {
          page: this.params.page,
          per_page: this.params.per_page
        },
        name: this.keyWorld
      }
      this.loading = true
      $get(api.getAvailableExpense, params).then((res) => {
        if (res.data.length === 20) {
          this.canLoad = true
          this.loadingTxt = ''
        } else {
          this.canLoad = false
          this.loadingTxt = '已加载全部费用项'
        }
        this.expenseItemData = this.expenseItemData.concat(res.data)
        this.selectExpenseItems.forEach(checkItem => {
          this.expenseItemData.forEach(dataItem => {
            if (checkItem.id === dataItem.id) {
              this.$nextTick(() => {
                this.$refs['expenseItemTable'].toggleRowSelection(dataItem, true)
                return
              })
            }
          })
        })
        this.loading = false
      })
    },
    inputChange() {
      this.loading = true
      this.params.page = 1
      this.debounceSearch()
    },
    searchExpense() {
      this.expenseItemData = []
      this.getExpenseItems()
    },
    // 选择费用
    handleSelectionChange(val) {
      this.selectExpenseItems = val
    },
    // 删除费用
    handleClose(index) {
      let targetId = this.selectExpenseItems[index].id
      this.expenseItemData.forEach(dataItem => {
        if (targetId === dataItem.id) {
          this.$refs['expenseItemTable'].toggleRowSelection(dataItem, false)
          return
        }
      })
      this.selectExpenseItems.splice(index, 1)
    },
    // 确认添加费用
    clickSureBtn() {
      this.dialogExpenseItem = false
      this.$emit('update:dialogExpenseItem', false)
      // 更新父组件费用项
      this.$emit('update-expense-item', this.selectExpenseItems)
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogExpenseItem = false
      this.$emit('update:dialogExpenseItem', false)
    },
    // 滚动到底部
    scrollToBottom11() {
      const container = this.container
      if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        if (!this.canLoad || this.loading) return
        this.params.page++
        this.getExpenseItems()
      }
    }
  },
  mounted() {
    this.container = document
    this.$nextTick(() => {
      let target = document.querySelector('.expenseItemTable>.el-table__body-wrapper')
      if (target) {
        this.container = target
      }
      this.debounceScroll= debounce(300, this.scrollToBottom11)
      this.container.addEventListener('scroll', this.debounceScroll)
    })
  },
  created() {
    this.getExpenseItems()
    this.debounceSearch = debounce(500, this.searchExpense)
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.debounceScroll)
  }
}
</script>

<style lang="scss" scoped>
  .nf-dialog {
    .right{
      max-height: 500px;
      overflow: auto;
    }
  }
  .span-title{
    margin: 0;
  }
  .nf-dialog-content{
    .left{
      max-height: none;
    }
  }
  .left{
    height: auto;
    .el-input{
      margin-bottom: 20px;
    }
  }
  .el-tag{
    margin-right: 20px;
    margin-bottom: 15px;
  }
  .select-expense-number{
    color: $themeColor;
    font-weight: 600;
    font-size: 16px;
  }
</style>
