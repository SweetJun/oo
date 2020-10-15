<template>
  <div class="nf-import">
    <nf-upload
      :url="uploadUrl"
      :multiple="false"
      list-type="text"
      showProgress
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel, .csv"
      :before-upload="beforeFileUpload"
      :upload-success="handleFileSuccess">
      <el-button size="medium" slot="content">导入</el-button>
    </nf-upload>
    <!-- 导入结果 -->
    <nf-dialog title="导入结果" :dialog-visible.sync="dialogResult" customFooterBtns width="700px">
      <div class="content" slot="content">
        <div class="top">
          <el-alert
            :title="successImportTitle"
            type="success"
            :closable="false"
            show-icon>
          </el-alert>
          <el-alert
            :title="failImportTitle"
            type="error"
            :closable="false"
            show-icon>
          </el-alert>
        </div>
        <div class="bottom">
          <p>未成功导入的数据</p>
          <el-table
            v-loading="resultLoading"
            :data="resultData"
            size="small"
            border>
            <el-table-column prop="row_number" label="所在行数" width="120"></el-table-column>
            <el-table-column prop="address" label="错误提示">
              <template slot-scope="{ row }">
                <span style="color:red;">{{ row.error_message }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogResult = false">关 闭</el-button>
      </div>
    </nf-dialog>
    <!-- 查看导入记录 -->
    <nf-dialog
      title="查看导入数据"
      :dialog-visible.sync="dialogImportRecord"
      customFooterBtns
      :before-close="handleClose"
      width="1000px">
      <div class="content" slot="content">
        <el-table
          size="small"
          v-loading="importRecordLoading"
          :data="importRecordData"
          border>
          <el-table-column label="序号" type="index" width="50"/>
          <el-table-column label="操作员" prop="creator_name" min-width="120"/>
          <el-table-column label="开始导入时间" sortable prop="process_start_time" min-width="120"/>
          <el-table-column label="导入完成时间" sortable min-width="120">
            <template slot-scope="{row}">
              <span v-if="row.process_end_time">{{row.process_end_time}}</span>
              <span v-else> {{row.progress ? row.progress : 0}} </span>
            </template>
          </el-table-column>
          <el-table-column label="成功条数" min-width="80">
            <template slot-scope="{row}">
              <span>{{row.process_count - row.failed_count}}</span>
            </template>
          </el-table-column>
          <el-table-column label="失败条数" min-width="80">
            <template slot-scope="{row}">
              <span style="color: #F56C6C">{{row.failed_count}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row}">
              <a class="a-down" download :href="downImportExcel + '/' + row.id"> 下载Excel </a>
              <el-button
                v-if="row.process_end_time"
                size="mini"
                style="margin-left: 10px;"
                type="text warning"
                @click="viewErrorDataInfo(row)">
                查看
              </el-button>
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
        <el-button size="small" @click="handleClose">关 闭</el-button>
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
import importTypes from '@/utils/pageType/import'
export default {
  name: 'NfImportExcel',
  props: {
    // store模块 名称
    storeModelName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pageId: importTypes[this.$route.path], // 导出数据的类型
      uploadUrl: api.fileUpload,
      downImportExcel: api.downImportExcel,
      successImportTitle: '成功导入 0 条数据',
      failImportTitle: '有 0 条数据不可导入',
      dialogResult: false, //导入结果
      resultLoading: false,
      dialogImportRecord: false, //导入记录弹框
      importRecordLoading: false,
      textInside: false, //导入进度条百分数在进度条里还是外
      resultData: [{row_number: '1', error_message: 'error'}],
      recordParams: {
        page: 1,
        per_page: 10
      },
      racordTotal: 0,
      importRecordData: [],
      timer: null
    };
  },
  computed: {
    // 非必填，作为condition参数的辅助，如果有些列表有特殊逻辑或是其导出有特殊逻辑，可以用该参数指定
    extraCondition() {
      return this.$store.state[this.storeModelName].extraCondition
    }
  },
  methods: {
    // 导入前
    beforeFileUpload(file) {
      let fileName = file.name
      let index1 = fileName.lastIndexOf(".")
      let index2 = fileName.length
      let suffix = fileName.substring(index1 + 1, index2) //后缀名
      if (suffix === 'xls'|| suffix === 'xlsx' || suffix === 'cvs') {
        return true
      }else {
        this.$message.warning('请上传excel文件')
        return false
      }
    },
    // 导入成功回调
    async handleFileSuccess(res) {
      let params = {
        type: this.pageId,
        file_id: res.file
      }
      // 额外辅助参数
      if (this.extraCondition) {
        params.extra_condition = this.extraCondition
      }
      await $post(api.importExcel, params)
      this.getImportRecordList()
    },
    // 查看导入错误信息
    async viewErrorDataInfo(row) {
      this.resultLoading = true
      this.dialogResult = true
      let result = await $get(`${api.importExcel}/${row.id}`)
      this.resultLoading = false
      this.resultData = result.error_info.errors || []
      if (result.import.process_count) {
        this.successImportTitle = `成功导入 ${result.import.process_count - result.import.failed_count} 条数据`
      } else {
        this.successImportTitle = `成功导入 0 条数据`
      }
      if (result.import.process_count) {
        this.failImportTitle = `有 ${result.import.failed_count} 条数据不可导入`
      } else {
        this.failImportTitle = `有 0 条数据不可导入`
      }
    },
    // 获取导入记录列表
    async getImportRecordList() {
      this.dialogImportRecord = true
      let params = {
        pager: {
          page: this.recordParams.page,
          per_page: this.recordParams.per_page
        },
        type: this.pageId
      }
      this.importRecordLoading = true
      let listData = await $get(api.importsList, params)
      this.importRecordData = listData.data
      this.racordTotal = listData.total
      this.importRecordLoading = false
      this.importRecordData.forEach(item => {
        this.$set(item, 'progress', '-')
      })
      this.timer = setInterval(() => {
        this.importRecordData.forEach(async item => {
          if (!item.process_end_time) {
            let data = await $get(api.importsProgress, {ids: JSON.stringify([item.id])})
            if (data[item.id] !== 100) {
              item.progress = data[item.id] ? Number(data[item.id]).toFixed(2) + '%' : 0 + '%'
            } else {
              let result = await $get(`${api.importExcel}/${item.id}`)
              item.process_end_time = result.import.process_end_time
              item.process_count = result.import.process_count
              item.failed_count = result.import.failed_count
            }
          }
        })
      }, 1500)
    },
    handleClose() {
      this.dialogImportRecord = false
      this.$store.dispatch('pageData/getTableData', this.storeModelName)
      window.clearInterval(this.timer)
    },
    handleSizeChange(per_page) {
      this.recordParams.per_page = per_page
      this.getImportRecordList()
    },
    handleCurrentChange(page) {
      this.recordParams.page = page
      this.getImportRecordList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .top {
    display: flex;
    justify-content: space-between;
    .el-alert {
      width: 48%;
    }
  }
  .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
  .dialog-footer{
    text-align: right;
    margin-top: 40px;
  }
</style>
