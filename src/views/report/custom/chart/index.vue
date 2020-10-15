<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :table-operation="tableOperation">
    </nf-table-page>
    <!-- 查看报表 -->
    <nf-dialog
      :title="chartTitle"
      :dialog-visible.sync="dialogChart"
      cancel-btn-text="关闭"
      :closeDialog="closeDialog"
      width="1260px">
      <div class="nf-dialog-content" slot="content" v-if="dialogChart">
        <nf-infinite-scroll
          v-if="displayType === 'list'"
          target=".el-table__body-wrapper"
          :infinite-scroll="loadMore">
          <template slot="content">
            <nf-table-page
              ref="nfTable"
              :store-model-name="dialogStoreModelName"
              :custom-store-model="true"
              max-height="300"
              :selection="false"
              :is-pagination="false"
              :show-table-operation="false">
            </nf-table-page>
            <p class="no-more-text" v-if="noMore && tableData.length > 0">没有更多了</p>
          </template>
        </nf-infinite-scroll>
        <pie
          v-if="displayType === 'basic_pie'"
          :store-model-name="dialogStoreModelName">
        </pie>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
import pie from './components/pie'
export default {
  components: {
    pie
  },
  data() {
    return {
      storeModelName: 'customChartModule',
      dialogStoreModelName: 'customChartDialogModule',
      tableOperation: {
        width: 104,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '查看报表',
              isShow: scope.row,
              click: ({row})=> {
                this.lookDetail(row)
              }
            }
          }
        ]
      },
      displayType: '',
      loading: false,
      chartTitle: '',
      dialogChart: false
    }
  },
  computed: {
    tableData() {
      return this.$store.state[this.dialogStoreModelName].tableData
    },
    pager() {
      return this.$store.state[this.dialogStoreModelName].pager
    },
    noMore() {
      return !this.pager
    }
  },
  methods: {
    async lookDetail(row) {
      this.dialogChart = true
      this.chartTitle = row.name
      this.displayType = row.display_type
      this.$store.commit(`${this.dialogStoreModelName}/updateEditTableList`, [])
      this.$store.commit(`${this.dialogStoreModelName}/updatePager`, '')
      this.$store.commit(`${this.dialogStoreModelName}/updateCurrentRow`, row)
      // 初次打开弹框，清空缓存的搜素项
      this.$store.commit(`${this.dialogStoreModelName}/updateParams1`, {condition: {}})
      this.$store.commit(`${this.dialogStoreModelName}/updateParams`, {})
    },
    closeDialog() {
      this.dialogChart = false
    },
    loadMore() {
      if (this.noMore) return
      this.$store.dispatch(`${this.dialogStoreModelName}/getTableData`)
    }
  }
}
</script>
<style lang="scss" scoped>
.no-more-text{
  margin-bottom: 0;
  text-align: center;
}
</style>
