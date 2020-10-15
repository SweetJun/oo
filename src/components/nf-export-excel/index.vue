<template>
  <div class="nf-export">
    <el-popover
      width="170"
      v-model="visiblePopover">
      <div class="export-type" v-if="hasImport">
        <el-radio v-model="exportType" :label="1" border size="medium">按照导入模板导出</el-radio>
        <el-radio v-model="exportType" :label="2" border size="medium">按照表头数据导出</el-radio>
      </div>
      <div v-else>
        <div class="el-message-box__status el-icon-warning"></div>
        你确定要导出数据吗？
      </div>
      <div class="export-footer">
        <el-button size="mini" type="text" @click="visiblePopover = false">取消</el-button>
        <el-button type="primary" size="mini" @click="handleDownload">确定</el-button>
      </div>
      <el-button slot="reference" size="medium">导出</el-button>
    </el-popover>
     <!-- 查看导入记录 -->
    <nf-dialog
      title="查看导出数据"
      :dialog-visible.sync="dialogExportRecord"
      customFooterBtns
      :append-to-body="true"
      :before-close="handleClose"
      width="1000px">
      <div class="content" slot="content">
        <el-table
          size="small"
          v-loading="exportRecordLoading"
          :data="exportRecordData"
          border>
          <el-table-column label="序号" type="index" width="50"/>
          <el-table-column label="操作员" prop="creator_name" min-width="120"/>
          <el-table-column label="开始导出时间" sortable prop="process_start_time" min-width="120"/>
          <el-table-column label="导出完成时间" sortable prop="process_end_time" min-width="120"></el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="{row}">
              <a
                class="a-down"
                v-if="row.process_end_time"
                download
                :href="downExportExcel + '/' + row.id">
                  下载
                </a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          :current-page="recordParams.page"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30]"
          :page-size="recordParams.per_page"
          layout="total, sizes, prev, pager, next"
          :total="racordTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeExportRecord">关 闭</el-button>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
/**
 * @Description: 导入excel组件
 * @Author: wjw
 * @Date: 2020-01-14 14:58:31
 */
import exportTypes from '@/utils/pageType/export'
import { transfromForBackend, filterOutType } from '@/utils/transformSearchData'
export default {
  name: "NfExportExcel",
  props: {
    // store模块 名称
    storeModelName: {
      type: String,
      default: ''
    },
    // 是否有导入
    hasImport: {
      type: Boolean,
      default: false
    },
    // 是否点击了确定导出
    isDot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageId: exportTypes[this.$route.path], // 导出数据的类型
      downExportExcel: api.exportFile,
      dialogExportRecord: false, //导出记录弹框
      exportRecordLoading: false,
      visiblePopover: false,
      isExportDone: false,
      exportType: 1,
      recordParams: {
        page: 1,
        per_page: 10
      },
      racordTotal: 0,
      exportRecordData: []
    };
  },
  computed: {
    // 新生成的表头数据 过滤表头checked数据
    tableActiveHeaders() {
      return this.tableHeadList.filter(item => item.checked === 1)
    },
    // 表头
    tableHeadList() {
      return this.$store.state[this.storeModelName].tableHeadList
    },
    // 非必填，与各种列表搜索api用于指定条件的condition参数相同
    params() {
      return this.$store.state[this.storeModelName].params
    },
    // 非必填，作为condition参数的辅助，如果有些列表有特殊逻辑或是其导出有特殊逻辑，可以用该参数指定
    extraCondition() {
      return this.$store.state[this.storeModelName].extraCondition
    }
  },
  methods: {
    handleDownload() {
      let searchData = _.cloneDeep(this.params)
      let condition = transfromForBackend(searchData.condition) // 把搜索组件绑定的值转换为后台需要的格式
      let conditionParams = filterOutType(condition) // 传给后台时过滤掉type属性

      let params = {
        type: this.pageId, // 页面id（type类型）
        condition: conditionParams.condition // 搜索条件
      }

      // 额外辅助参数
      if (this.extraCondition) {
        params.extra_condition = this.extraCondition
      }
      // 没有导入时，按表头导出传columns，或者有导入时选择按表头导出传columns
      if (!this.hasImport || this.exportType === 2) {
        params.columns = []
        this.tableActiveHeaders.forEach(item => {
          // 图片不导出
          if (item.prop !== 'image') {
            params.columns.push(item.prop)
          }
        })
      }

      this.visiblePopover = false
      $post(api.export, params).then(() => {
        this.$emit('update:isDot', true)
        this.isExportDone = true
      })
    },
    // 获取导入记录列表
    getExportRecordList() {
      this.dialogExportRecord = true
      let params = {
        pager: {
          page: this.recordParams.page,
          per_page: this.recordParams.per_page
        },
        type: this.pageId
      }
      this.exportRecordLoading = true
      $get(api.exports, params).then(res => {
        this.exportRecordData = res.data
        this.racordTotal = res.total
        this.exportRecordLoading = false
      })
    },
    // 点击关闭
    closeExportRecord() {
      this.dialogExportRecord = false
      this.$emit('update:isDot', false)
    },
    // 弹框关闭之前回调
    handleClose(done) {
      this.$emit('update:isDot', false)
      this.dialogExportRecord = false
      done()
    },
    handleSizeChange(per_page) {
      this.recordParams.per_page = per_page
      this.getExportRecordList()
    },
    handleCurrentChange(page) {
      this.recordParams.page = page
      this.getExportRecordList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
  .dialog-footer{
    text-align: right;
    margin-top: 40px;
  }
  .export-type{
    .el-radio{
      margin-right: 0;
      display: block;
      &+.el-radio.is-bordered{
        margin-left: 0;
        margin-top: 15px;
      }
    }
  }
  .export-footer{
    text-align: right;
    margin-top: 15px;
  }
  .el-message-box__status.el-icon-warning{
    vertical-align: sub;
    position: static;
    transform: none;
  }
</style>
