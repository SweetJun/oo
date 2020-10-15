<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
      <div class="table-top-left" slot="top-btn-left" v-if="roles['vehicle_brand_add']">
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddBrand">
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
        <el-form :model="brandForm" :rules="brandRules" ref="brandForm" label-position="top">
          <el-form-item label="品牌名称：" prop="name">
            <el-input v-model="brandForm.name"></el-input>
          </el-form-item>
          <el-form-item label="品牌类型：">
             <el-radio-group v-model="brand_id">
                <el-radio :label="0">一级品牌</el-radio>
                <el-radio :label="1">二级品牌</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="选择一级品牌：" prop="p_id" v-if="brand_id === 1">
             <el-select filterable clearable v-model="brandForm.p_id" placeholder="请选择一级品牌" >
              <el-option
                v-for="(brand, index) in oneLevelBrand"
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
      storeModelName: 'brandModule',
      dialogVisible: false,
      dialogTitle: '添加品牌',
      isEditing: false,
      brand_id: 0,
      oneLevelBrand: [],
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
                let apiUrl = `${api.vehicleBrand}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row, true)
              }
            }
          }
        ]
      },
      batchOptions: [
        {
          id: 0,
          role: 'vehicle_brand_delete',
          label: '批量删除',
          url: api.vehicleBrandBatchDel
        }
      ],
      brandForm: {
        name: '',
        p_id: ''
      },
      brandRules: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }]
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
    // 获取下拉品牌列表
    searchVehicleBrand() {
      let data = {
        status: 1,
        level: 1
      }
      $get(api.searchVehicleBrand, data).then(res => {
        this.oneLevelBrand = res
      })
    },
    // 点击添加品牌
    handleAddBrand() {
      this.searchVehicleBrand()
      this.dialogTitle = '添加品牌'
      this.dialogVisible = true
      this.isEditing = false
      this.brand_id = 0
      this.brandForm = {
        name: '',
        p_id: ''
      }
    },
    // 编辑
    editFun(row) {
      this.searchVehicleBrand()
      this.dialogTitle = '编辑品牌'
      this.dialogVisible = true
      this.isEditing = true
      this.currentRow = row
      this.brandForm.name = row.name
      if (row.p_id === 0) {
        this.brand_id = 0
        this.brandForm.p_id = ''
      } else {
        this.brand_id = 1
        this.brandForm.p_id = row.p_id
      }
    },
    // 添加/编辑 保存
    clickSureBtn(loading) {
      this.$refs['brandForm'].validate((valid) => {
        if (valid) {
          if (this.brand_id === 0) {
            this.brandForm.p_id = 0
          }
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.vehicleBrand}/${this.currentRow.id}`
            $put(apiUrl, this.brandForm).then(() =>{
              loading(false)
              this.dialogVisible = false
              this.$message.success('编辑成功')
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.vehicleBrand, this.brandForm).then(() =>{
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
    this.searchVehicleBrand()
  }
}
</script>

<style lang="scss" scoped>
  .el-select{
    width: 100%;
  }
</style>
