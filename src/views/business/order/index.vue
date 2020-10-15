<template>
  <div class="order">
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/order/add"
      :selection="false"
      :table-operation="tableOperation">
      <div class="importBox" slot="top-btn-right">
        <el-button style="position:absolute;right:265px" class="orderDownloadBtn" v-if="pageRles['order_import']" size="medium" type="text" @click="downTemplate"> 下载导入模板 </el-button>
        <el-button style="position:absolute;right:185px" class="orderImportBtn" v-if="pageRles['order_import']" size="medium" primary @click="importExcelBtn">导入</el-button>
        <!-- 导入记录列表 -->
        <el-button
         style="position:absolute;right:52px"
          class="nf-icon-btn orderImportRecordBtn"
          type="primary"
          v-if="pageRles['order_import']"
          size="medium"
          icon="el-icon-upload2"
          @click="viewImport">
        </el-button>
      </div>
    </nf-table-page>
    <nf-dialog :title="'批量导入运单'" v-if="dialogVisible" :dialog-visible.sync="dialogVisible" :click-sure-btn="importExcel"
      :click-cancel-btn="closeDialog" :width="'400px'">
      <div class="content" slot="content">
        <el-form class="box" :model="ruleForm" ref="ruleForm" :rules="rules" label-position="top">
          <el-form-item label="选择客户：" prop="client">
            <nf-select
              style="width:100%"
              :placeholder="'请选择客户'"
              :valueKey="'key'"
              :options="client_list"
              :value.sync="ruleForm.client">
            </nf-select>
          </el-form-item>
          <el-form-item label="选择办事处：" prop="agency">
            <el-select style="width:100%" v-model="ruleForm.agency" clearable filterable>
              <el-option v-for="(item,index) in agency_list" :key="index" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="file_id">
            <nf-order-import ref="nfOrderImport" :orderDialogVisible.sync="dialogVisible" :store-model-name="storeModelName" :file_id.sync="ruleForm.file_id" :uploadParams.sync="uploadParams"></nf-order-import>
          </el-form-item>
        </el-form>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
import { download } from '@/utils/utils'
import importKey from '@/utils/pageType/import'
export default {
  data() {
    return {
      storeModelName: 'orderModule',
      dialogVisible: false,
      pageRles: {},
      client_list: [],
      uploadParams: {
        type: '',
        file_id: ''
      },
      ruleForm: {
        agency: '',
        client: '',
        client_obj: {},
        client_display: '',
        file_id: ''
      },
      rules: {
        agency: [{
          required: true,
          message: '请选择办事处',
          trigger: 'change'
        }],
        client: [{
          required: true,
          message: '请选择客户',
          trigger: 'change'
        }],
        file_id: [{
          required: true,
          message: '请上传excel',
          trigger: 'change'
        }]
      },
      tableOperation: {
        width: 180,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: "编辑",
              type: "primary",
              isShow: scope.row.acl.can_edit && this.roles.order_edit,
              click: ({row}) => {
                this.goNextPage('/order/edit', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: "添加费用",
              type: "primary",
              isShow: scope.row && this.roles.order_set_extra_expense,
              click: ({row}) => {
                this.goNextPage('/order/expense', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: "删除",
              type: "danger",
              isShow: scope.row.acl.can_delete && this.roles.order_delete,
              click: ({row}) => {
                let apiUrl = `${api.order}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row, true)
              }
            }
          }
        ]
      },
      batchOptions: [{
        id: 0,
        role: 'order',
        label: '批量删除',
        url: api.order
      }]
    }
  },
  mounted() {
    // 按钮定位
    this.$nextTick(() => {
      document.querySelector('.useInOrder').style.position = 'relative'
      // 在mounted里也获取不到dom，写了个延时
      setTimeout(() => {
        document.querySelector('.order .useInOrderExport').style.position = 'relative'
        document.querySelector('.order .useInOrderExport').style.right = '104px'
        document.querySelector('.order .useInOrderExportRecord').style.position = 'absolute'
        document.querySelector('.order .useInOrderExportRecord').style.right = '0'
      },1000)
    })
  },
  created() {
    this.getPrivileges()
    this.$store.dispatch('orderModule/getAgency')
    let url = `${api.searchItemOption}/client_name_select`
    $get(url).then(res => {
      this.client_list = res
    })
  },
  computed: {
    roles() {
      return this.$store.state[this.storeModelName].roles
    },
    agency_list() {
      return this.$store.state['orderModule'].agency_list
    }
  },
  methods: {
    clickSureBtn(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true);
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.vehicleWarehouse}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() => {
              this.$message.success('编辑成功');
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
              this.dialogVisible = false;
              loading(false);
            }).catch(() => {
              loading(false);
            })
          } else {
            $post(api.vehicleWarehouse, this.formData).then(() => {
              this.$message.success('添加成功');
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
              this.dialogVisible = false;
              loading(false);
            }).catch(() => {
              loading(false);
            })
          }
        } else {
          return false;
        }
      })
    },
    // 权限检测 import
    getPrivileges() {
      this.checkPrivileges(['order_import']).then(res => {
        this.pageRles = res ? res : {}
      })
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
    },
    // 导入
    importExcelBtn() {
      this.ruleForm = {
        agency: '',
        client: '',
        client_obj: {},
        client_display: '',
        file_id: ''
      }
      this.dialogVisible = true
    },
    importExcel() {
      this.$refs['ruleForm'].validate( async(valid) => {
        if (valid) {
          // 额外辅助参数
          this.uploadParams.extra_condition = {
            client: this.ruleForm.client.key,
            agency: this.ruleForm.agency
          }
          if(!this.uploadParams.file_id) {
            this.$message.closeAll()
            this.$message.warning('请上传excel')
            return
          }
          await $post(api.importExcel, this.uploadParams)
          this.$refs.nfOrderImport.getImportRecordList()
        } else {
          return false;
        }
      });
    },
    // 下载导入模板
    downTemplate() {
      let key = importKey[this.$route.path]
      let href = `${api.downImportTemplate}/${key}`
      let title = this.$route.meta.title
      download(href, title)
    },
    // 查看导入记录
    viewImport() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.nfOrderImport.getImportRecordList()
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .box{
    .el-form-item{
      width: 100%;
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
