<template>
  <div>
    <!-- 搜索 -->
    <nf-top-search
      :store-model-name="storeModelName"
      :search-click="handleSearchClick"
      :is-loading="isLoading">
    </nf-top-search>
    <!-- 表格 -->
    <div class="nf-table" v-loading="isLoading" element-loading-text="玩儿命加载中...">
      <!-- 编辑表头 -->
      <nf-edit-table
        :is-edit-table.sync="isEditTable"
        :table-head-list="tableHeadList"
        :store-model-name="storeModelName">
      </nf-edit-table>
      <!-- 表格操作组 -->
      <div class="nf-table-operation">
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="top-operation">
          <el-col :span="14">
            <el-button
              v-if="roles[pageRoleId + '_add'] && addBtnLink"
              class="add-btn"
              size="medium"
              icon="el-icon-plus"
              type="primary"
              @click="handleToAddClick">
              {{ addBtnLinkText }}
            </el-button>

            <slot name="top-btn-left" />
            <div class="batch-box" v-if="batchOptions.length > 0">
              <el-select
                v-model="batchVal"
                value-key="id"
                placeholder="请选择批量操作"
                size="medium"
                @change="batchChanged">
                <template v-for="(item, index) in batchOptions">
                  <el-option
                    v-if="roles[item.role]"
                    :key="index"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </template>
              </el-select>
              <el-button
                type="primary"
                size="medium"
                :disabled="multipleSelection.length == 0 || !batchVal"
                @click="batchOperation">
                确认
              </el-button>
            </div>
          </el-col>
          <el-col :span="10">
            <el-row
              class="useInOrder"
              type="flex"
              justify="end"
              align="middile">
              <slot name="top-btn-right" />
              <el-button v-if="roles[pageRoleId + '_import']" size="medium" type="text" @click="downTemplate"> 下载导入模板 </el-button>
              <!-- 自定义表头 -->
              <el-button
                v-if="!showTableOperation && showEditTableHeader"
                size="medium"
                @click="isEditTable = true">
                自定义表头
              </el-button>
              <!-- 导入 -->
              <nf-import-excel ref="import" v-if="roles[pageRoleId + '_import']" :store-model-name="storeModelName"></nf-import-excel>
              <!-- 导出 -->
              <nf-export-excel
                class="useInOrderExport"
                ref="export"
                v-if="roles[pageRoleId + '_export']"
                :has-import="roles[pageRoleId + '_import']"
                :is-dot.sync="isDot"
                :store-model-name="storeModelName">
              </nf-export-excel>
              <!-- 导入记录列表 -->
              <el-button
                class="nf-icon-btn"
                type="primary"
                v-if="roles[pageRoleId + '_import']"
                size="medium"
                icon="el-icon-upload2"
                @click="viewImport">
              </el-button>
              <!-- 导出记录列表 -->
              <el-badge class="useInOrderExportRecord" :is-dot="isDot">
                <el-button
                  class="nf-icon-btn"
                  type="primary"
                  v-if="roles[pageRoleId + '_export']"
                  size="medium"
                  icon="el-icon-download"
                  @click="viewExport">
                </el-button>
              </el-badge>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 -->
      <el-table
        ref="nf-el-table"
        v-bind="$attrs"
        v-on="$listeners"
        :row-key="rowKey"
        :data="tableData"
        :size="defaultOptions.size"
        :max-height="defaultOptions['max-height']"
        :row-class-name="tableRowClassName"
        :class="{'headerFixed': headerFixed}"
        :border="defaultOptions.border"
        @row-click="rowClick"
        @select="handleSelectionChange"
        @select-all="handleSelectionAll">
        <!-- 多选 -->
        <el-table-column
          v-if="defaultOptions.selection"
          type="selection"
          reserve-selection
          width="40"
          :selectable="defaultOptions.selectable"/>

        <!-- 多级复杂表头 -->
        <slot v-if="complexHeader" :row="scope.row" :name="item.slotName" />

        <!-- 非多级复杂表头 -->
        <el-table-column
          v-else
          v-for="(item, index) in tableActiveHeaders"
          :key="index"
          :min-width="item.width ? item.width : item.label.length * 14 + 44"
          show-overflow-tooltip
          :sortable="item.sortable ? item.sortable : false"
          :prop="item.prop"
          :label="item.label"
          :fixed="firstColumnFixed && index === 0">
          <template slot-scope="scope">
            <!-- 追加插槽渲染 -->
            <slot v-if="item.slotName" :row="scope.row" :name="item.slotName" />

            <!-- 普通渲染 -->
            <template v-else>
              <!-- 普通数据 -->
              <span v-if="!scope.row[item.prop] || scope.row[item.prop] === '' || scope.row[item.prop] === 0"> - </span>
              <!-- 数组数据展示 -->
              <template v-else-if="Array.isArray(scope.row[item.prop])">
                <span v-if="scope.row[item.prop].length === 0"> - </span>
                <template v-else>
                  <span v-for="(v, v_index) in scope.row[item.prop]" :key="v_index">
                    {{v}}{{ v_index === scope.row[item.prop].length - 1 ? '' : '，'}}
                  </span>
                </template>
              </template>
              <span v-else> {{scope.row[item.prop]}} </span>
            </template>
          </template>
        </el-table-column>

        <!-- 操作按钮 -->
        <el-table-column
          v-if="showTableOperation"
          :fixed="tableOperation.fixed ? tableOperation.fixed : false"
          :width="tableOperation.width">
          <template slot="header" >
            <span>操作</span>
            <!-- 自定义表头 -->
            <el-button
              v-if="showEditTableBtn"
              type="text"
              class="setting-btn"
              icon="el-icon-setting"
              @click="isEditTable = true">
            </el-button>
          </template>
          <template slot-scope="scope">
            <template v-if="showButtonGroups">
              <!-- 以按钮组的方式 -->
              <template v-for="(btn, index) in tableOperation.buttonGroups">
                <template v-if="_.isFunction(btn)">
                  <div :key="index" v-if="btn(scope).isShow" class="operation-btn-box">
                    <el-button
                      :size="btn(scope).size || 'mini'"
                      :type="'text ' + (btn(scope).type || '')"
                      :icon="btn(scope).icon"
                      @click.stop="btn(scope).click(scope)">
                      {{ btn(scope).name }}
                    </el-button>
                  </div>
                </template>
                <div :key="index" v-else class="operation-btn-box">
                  <el-button
                    v-if="btn.isShow"
                    :type="'text ' + (btn.type || '')"
                    :icon="btn.icon"
                    :size="btn.size || 'mini'"
                    @click.stop="btn.click(scope)">
                    {{ btn.name }}
                  </el-button>
                </div>
              </template>
            </template>
            <template v-if="showDropdownGroups">
              <!-- 以下拉的方式 -->
              <el-dropdown :class="setDropdownClass(tableOperation.buttonGroups, scope)" trigger="click" v-if="tableOperation.dropdownGroups.length > 0">
                <el-button type="text default" size="mini" @click.stop="">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <template v-for="(dropdown, index) in tableOperation.dropdownGroups">
                    <template v-if="_.isFunction(dropdown)">
                      <el-dropdown-item
                        v-if="dropdown(scope).isShow"
                        :key="index"
                        divided
                        @click.native="dropdown(scope).click(scope)">
                        {{ dropdown(scope).name }}
                      </el-dropdown-item>
                    </template>
                    <template v-else>
                      <el-dropdown-item
                        :key="index"
                        divided
                        @click.native="dropdown.click(scope)">
                        {{ dropdown.name }}
                      </el-dropdown-item>
                    </template>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <nf-pagination
        v-if="isPagination"
        :currentPage="params.page"
        :pageSize="params.per_page"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange">
      </nf-pagination>
    </div>
  </div>
</template>

<script>
/**
* @Description: 表格组件（包含搜索、编辑表头、添加导出等操作按钮、分页组件）
* @Author: wjw
* @Date: 2020-01-06 13:32:56
*/
import { download, updateParams } from '@/utils/utils'
import privilege from '@/utils/pageType/privileges'
import importKey from '@/utils/pageType/import'
import { mapState, mapActions } from 'vuex'
export default {
  name: "NfTablePage",
  props: {
    // store模块 名称
    storeModelName: {
      type: String,
      default: ''
    },
    // 是否自定义store
    customStoreModel: {
      type: Boolean,
      default: false
    },
    // 表格数据唯一性字段
    rowKey: {
      type: String,
      default: 'id'
    },
    // 添加按钮路由路径
    addBtnLink: {
      type: String,
      default: ''
    },
    // 添加按钮路由路径
    addBtnLinkText: {
      type: String,
      default: '添加'
    },
    // 批量操作
    batchOptions: {
      type: Array,
      default: () => []
    },
    // table 操作栏按钮
    showTableOperation: {
      type: Boolean,
      default: true
    },
    // 没有操作栏的自定义表头
    showEditTableHeader: {
      type: Boolean,
      default: true
    },
    // table 操作栏按钮
    tableOperation: {
      type: Object,
      default: () => {}
    },
    // 是否开启编辑表头功能
    showEditTableBtn: {
      type: Boolean,
      default: true
    },
    // 是否使用多级复杂表头
    complexHeader: {
      type: Boolean,
      default: false
    },
    // 是否显示按钮组
    showButtonGroups: {
      type: Boolean,
      default: true
    },
    // 是否显示下拉框组
    showDropdownGroups: {
      type: Boolean,
      default: false
    },
    // 是否显示分页
    isPagination: {
      type: Boolean,
      default: true
    },
    // 非checkbox点击高亮（可多选）
    highlightClickRow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      batchVal: '',
      headerFixed: false,
      isDot: false, // 导出标记
      container: null,
      pageRoleId: privilege[this.$route.path], // 页面按钮的权限id前缀
      isEditTable: false, // 是否显示编辑表头 弹出层
      // table 默认参数
      defaultOptions: {
        border: true,
        size: 'mini',
        selection: true,
        selectable: false
      },
      tableHeadList: [],
      firstColumnFixed: false
    }
  },
  watch: {
    tableHeads: {
      handler(newVal) {
        this.$vlf.getItem(this.storeModelName).then(val => {
          if (val) {
            this.tableHeadList = val.headers
          } else {
            this.tableHeadList = newVal
          }
        })
      },
      immediate: true,
      deep: true
    },
    columnFixed: {
      handler(newVal) {
        this.$vlf.getItem(this.storeModelName).then(val => {
          if (val) {
            this.firstColumnFixed = val.fixed
          } else {
            this.firstColumnFixed = newVal
          }
        })
      },
      immediate: true
    },
    'count'(val) {
      // 当val=0时，说明三个接口执行完成，开始计算滚动高度
      if (val === 0) {
        this.addScrollListener()
      }
    }
  },
  computed: {
    ...mapState('pageData', [
      'count',
      'columnFixed'
    ]),
    // 表头
    tableHeads() {
      return this.$store.state[this.storeModelName].tableHeadList
    },
    // 新生成的表头数据 过滤表头checked数据
    tableActiveHeaders() {
      return this.tableHeadList.filter(item => item.checked === 1)
    },
    // 列表请求数据loading
    isLoading() {
      return this.$store.state[this.storeModelName].isLoading
    },
    // 从store里读取列表数据
    tableData() {
      return this.$store.state[this.storeModelName].tableData
    },
    // 列表接口穿参数据
    params() {
      return this.$store.state[this.storeModelName].params
    },
    // 数据总条数
    total() {
      return this.$store.state[this.storeModelName].total
    },
    // 多选的数据
    multipleSelection() {
      return this.$store.state[this.storeModelName].multipleSelection
    },
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    ...mapActions('pageData', {
      getStoreSearchData: 'getSearchData',
      getStorePrivileges: 'getPrivileges',
      getStoreTableData: 'getTableData'
    }),
    // dropdown设置class，防止没有其他按钮时，左边有margin
    setDropdownClass(buttonGroups, scope) {
      let index = _.findIndex(buttonGroups, item => {
        if (_.isFunction(item)) {
          return item(scope).isShow === true
        } else {
          return item.isShow === true
        }
      })
      return index > -1 ? 'has-margin-left' : ''
    },
    // 设置选中后行的className
    tableRowClassName({row}) {
      if (row.rowClass) {
        return row.rowClass;
      }
      return '';
    },
    // 非checkbox点击高亮（可多选）
    rowClick(row) {
      if (!this.highlightClickRow) return
      if (row.rowClass) {
        this.$delete(row, 'rowClass')
      } else {
        this.$set(row, 'rowClass', 'selected-row')
      }
    },
    // 点击添加按钮跳转
    handleToAddClick() {
      this.$router.push(this.addBtnLink)
    },
    handleSelectionChange(val) {
      let multipleSelection = val.map(item => item[this.rowKey])
      this.$store.commit(`${this.storeModelName}/updateSelection`, multipleSelection)
    },
    handleSelectionAll(val) {
      let multipleSelection = val.map(item => item[this.rowKey])
      this.$store.commit(`${this.storeModelName}/updateSelection`, multipleSelection)
    },
    // 选择批量操作 重置
    batchChanged() {
      this.$store.commit(`${this.storeModelName}/updateSelection`, [])
      this.$refs['nf-el-table'].clearSelection()
    },
    batchOperation() {
      if (!this.batchVal) {
        this.alert('请先选择批量操作选项').catch(() => {})
        return
      }
      const h = this.$createElement;
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '您确认要 '),
          h('span',
            { style: 'color: #409EFF; font-weight: 600; font-size: 16px'},
            `${this.batchVal.label}${this.multipleSelection.length}条`
          ),
          h('span', null, ' 所选数据?')
        ]),
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        $post(this.batchOptions[this.batchVal.id].url, {ids: this.multipleSelection}).then(() => {
          this.$message.success('操作完成')
          // 处理最后一页批量删除后的问题
          if (_.includes(this.batchVal.label, '删除')) {
            let total = this.total // 总条数
            let params = this.params // 请求数据的分页参数
            let length = this.multipleSelection.length // 删除的条数
            let pages = Math.ceil((total - length) / params.per_page) // 删除后，数据总页数
            let currentPage = Number(params.page) > pages ? pages : Number(params.page) // 如果当前页完全删除，跳转到上一页
            currentPage = currentPage < 1 ? 1 : currentPage
            if (Number(currentPage) !== Number(params.page)) {
              updateParams(this, { page: currentPage })
              this.$store.commit(`${this.storeModelName}/updateParams`, { page: currentPage })
            }
          }
          this.$refs['nf-el-table'].clearSelection();
          this.getTableList()
          this.$store.commit(`${this.storeModelName}/updateSelection`, [])
        })
      }).catch(() => {})
    },
    // 点击搜索
    handleSearchClick(condition) {
      //TODO: 实现搜索记忆功能
      let searchParams = {
        page: 1,
        condition: condition
      }
      this.updatePathParams('search')
      this.$store.commit(`${this.storeModelName}/updateTableData`, [])
      this.$store.commit(`${this.storeModelName}/updateParams`, searchParams)
      // 20200826我的报表➡️查看报表，滚动分页后查询会带上页码导致查询错误
      this.$store.commit(`${this.storeModelName}/updatePager`, '')
      this.getTableList()
    },
    handleCurrentChange(currentPage) {
      this.$store.commit(`${this.storeModelName}/updateParams`, {
        page: currentPage
      })
      this.updatePathParams()
      this.getTableList()
    },
    handleSizeChange(pageSize) {
      this.$store.commit(`${this.storeModelName}/updateParams`, {
        per_page: pageSize
      })
      this.updatePathParams()
      this.getTableList()
    },
    // 在原本url上设置参数，记录页码等
    updatePathParams(flag) {
      let query = _.cloneDeep(this.$route.query)
      let pageParams = {
        page: flag === 'search' ? 1 : this.params.page,
        per_page: this.params.per_page
      }
      Object.assign(query, pageParams)
      this.$router.replace({ query: query }).catch(() =>{})
    },
    downTemplate() {
      let key = importKey[this.$route.path]
      let href = `${api.downImportTemplate}/${key}`
      let title = this.$route.meta.title
      download(href, title)
    },
    // 查看导入记录
    viewImport() {
      this.$refs.import.getImportRecordList()
    },
    // 查看导出记录
    viewExport() {
      this.$refs.export.getExportRecordList()
    },
    getSearchData() {
      if (this.customStoreModel) {
        this.$store.dispatch(`${this.storeModelName}/getSearchData`)
        return
      }
      this.getStoreSearchData(this.storeModelName)
    },
    getPrivileges() {
      this.getStorePrivileges(this.storeModelName)
    },
    getTableList() {
      if (this.customStoreModel) {
        this.$store.dispatch(`${this.storeModelName}/getTableData`)
        return
      }
      this.getStoreTableData(this.storeModelName)
    },
    // 待页面渲染完成后，根据DOM监听滚动事件
    addScrollListener() {
      this.container = document;
      let target = document.querySelector('#nucarf-main .el-scrollbar__wrap')
      if (!target) return
      this.container = target
      this.elTableWrapper = document.querySelector('.nf-table .el-table__header-wrapper')
      this.distance = this.elTableWrapper.getBoundingClientRect().top
      this.container.addEventListener('scroll', this.scrollAffix)
    },
    // 滚动监听，图钉吸顶效果
    scrollAffix() {
      const scrollTop = this.container.scrollTop
      const el_table = document.querySelector('.nf-table .el-table')
      const toTop = el_table.getBoundingClientRect().top
      //如果被卷曲的高度大于吸顶元素到顶端位置的距离
      const fixedLeft = document.querySelector('.el-table__fixed .el-table__fixed-header-wrapper')
      const fixedRight = document.querySelector('.el-table__fixed-right .el-table__fixed-header-wrapper')
      let table_body = document.querySelector('.nf-table .el-table__body-wrapper')
      if (!fixedRight || !table_body) return
      if (toTop < 90) {
        this.headerFixed = true
        this.elTableWrapper.style.top = scrollTop - (this.distance - 90) + 'px'
        fixedRight.style.top = scrollTop - (this.distance - 90) + 'px'
        table_body.style.marginTop = '30px'
        if (fixedLeft) {
          fixedLeft.style.top = scrollTop - (this.distance - 90) + 'px'
        }
      } else {
        this.headerFixed = false
        this.elTableWrapper.style.top = ''
        fixedRight.style.top = ''
        table_body.style.marginTop = ''
        if (fixedLeft) {
          fixedLeft.style.top = ''
        }
      }
    }
  },
  created() {
    Object.assign(this.defaultOptions, this.$attrs)
    // 读取url页码等参数
    let urlPrams = this.$route.query
    let updataParams = {
      page: urlPrams.page ? urlPrams.page : 1,
      per_page: urlPrams.per_page ? urlPrams.per_page : 20
    }
    this.$store.commit(`${this.storeModelName}/updateTableData`, [])
    this.$store.commit(`${this.storeModelName}/updateParams`, updataParams)
    this.getSearchData()
    this.getPrivileges()
    this.getTableList()
  },
  beforeDestroy() {
    if (this.container) {
      this.container.removeEventListener('scroll', this.scrollAffix)
    }
  }
}
</script>

<style lang="scss" scoped>
  .nf-table{
    padding: 10px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .el-table /deep/{
    .selected-row{
      background: rgb(220, 237, 220);
    }
    .cell span{
      max-width: 100%;
      @include ellipsis
    }
  }
  .top-operation /deep/{
    .el-button, .el-select{
      margin-bottom: 10px;
    }
    .add-btn{
      margin-right: 10px;
    }
  }
  .batch-box{
    display: inline-block;
    .el-button{
      margin-left: 5px;
    }
  }
  .setting-btn{
    font-size: 16px;
    position: absolute;
    right: 0;
    top: 0;
    height: 23px;
    padding: 0 10px;
    color: #909399;
    &:hover{
      color: #333;
    }
  }
  .operation-btn-box{
    display: inline-block;
    &+.operation-btn-box .el-button{
      margin-left: 12px;
    }
  }
  .operation-no-btn-box{
    margin-left: 0;
    display: inline-block;
  }
  .el-dropdown{
    display: inline-block;
    &.has-margin-left{
      margin-left: 10px;
    }
  }
  .el-dropdown-menu{
    padding: 0;
    width: 126px;
    &>li{
      &:first-child{
        margin-top: 0;
      }
      &:last-of-type{
        margin-bottom: 6px;
      }
    }
  }
  .nf-icon-btn /deep/{
    margin-left: 10px;
    padding: 6px 10px;
    [class^=el-icon-]{
      font-size: 20px;
    }
  }
</style>
