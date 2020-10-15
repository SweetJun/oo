<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
      <div class="table-top-left" slot="top-btn-left" v-if="roles['vehicle_code_add']">
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddCode">
          添加
        </el-button>
      </div>
    </nf-table-page>
    <nf-dialog
      :title="dialogTitle"
      :dialog-visible.sync="dialogVisible"
      width="400px"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-form :model="codeForm" :rules="codeRules" ref="codeForm" label-position="top">
          <el-form-item label="代码名称：" prop="code">
            <el-input v-model="codeForm.code"></el-input>
          </el-form-item>
          <el-form-item label="所属车型：" prop="v_id">
            <el-select
              v-model="codeForm.v_id"
              clearable
              filterable
              placeholder="请选择车型">
              <el-option
                v-for="(brand, index) in carTypeList"
                :key="index"
                :label="brand.name"
                :value="brand.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'vehicleCodeModule',
      dialogVisible: false,
      dialogTitle: '添加车型代码',
      carTypeList: [],
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit,
              click: ({row})=> {
                this.editFun(row)
              }
            }
          },
          scope => {
            return {
              name: '删除',
              type: 'danger',
              isShow: scope.row.acl.can_delete,
              click: ({row})=> {
                let apiUrl = `${api.vehicleCode}/${row.v_id}/${row.code}`
                this.deleteTableRow(apiUrl, this.storeModelName, row, true)
              }
            }
          }
        ]
      },
      batchOptions: [
        {
          id: 0,
          role: 'vehicle_code_delete',
          label: '批量删除',
          url: api.vehicleCodeBatchDel
        }
      ],
      codeForm: {
        code: '',
        v_id: ''
      },
      codeRules: {
        code: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
        v_id: [{ required: true, message: '请选择车型', trigger: 'change' }]
      }
    }
  },
  computed: {
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    // 所属车型下拉
    searchVehicleCode() {
      $get(api.searchVehicle, {status: 1}).then(res => {
        this.carTypeList = res
      })
    },
    // 添加车型代码
    handleAddCode() {
      this.dialogTitle = '添加车型代码'
      this.dialogVisible = true
      this.isEditing = false
      this.codeForm = {
        code: '',
        v_id: ''
      }
    },
    // 编辑
    editFun(row) {
      this.dialogTitle = '编辑车型代码'
      this.dialogVisible = true
      this.isEditing = true
      this.currentRowCopy = _.cloneDeep(row)
      this.currentRow = row
      this.codeForm.code = row.code
      this.codeForm.v_id = row.v_id
    },
    // 添加/编辑 保存
    clickSureBtn(loading) {
      this.$refs['codeForm'].validate((valid) => {
        if (valid) {
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.vehicleCode}/${this.currentRowCopy.v_id}/${this.currentRowCopy.code}`
            $put(apiUrl, this.codeForm).then(() =>{
              loading(false)
              this.dialogVisible = false
              this.currentRow.code = this.codeForm.code
              this.currentRow.v_id = this.codeForm.v_id
              this.$message.success('编辑成功')
            }).catch(() => {
              loading(false)
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
            })
          } else {
            $post(api.vehicleCode, this.codeForm).then(() =>{
              loading(false)
              this.dialogVisible = false
              this.$message.success('添加成功')
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
            }).catch(() => {
              loading(false)
            })
          }
        } else {
          return false;
        }
      })
    }
  },
  created() {
    let query = this.$route.query
    let search = ''
    if (query.search) {
      search = JSON.parse(query.search)
    } else {
      search = ''
    }
    this.$store.commit(`${this.storeModelName}/updateQuery`, search)
    this.$store.commit(`${this.storeModelName}/updateParams`, {
      condition: {
        vehicle_name: search
      }
    })
    this.$store.commit(`${this.storeModelName}/updateSearchData`, [])
    this.searchVehicleCode()
  }
}
</script>

<style lang="scss" scoped>
  .nf-dialog-content{
    .el-select{
      width: 100%;
    }
  }
</style>
