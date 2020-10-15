<template>
  <div>
    <nf-form-wrap title="商品车管理" :on-save-btn-click="onSaveBtnClick">
      <el-form :model="formData" ref="ruleForm" :rules="formRules" inline label-position="top">
        <div>
          <el-form-item label="车型名称：" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="所属品牌：" prop="brand">
            <el-select v-model="formData.brand_id" filterable placeholder="请选择品牌" >
              <el-option
                v-for="(brand, index) in twoLevelBrand"
                :key="index"
                :label="brand.name"
                :value="brand.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button class="add-quickly-btn" type="primary" @click="addBrand">添加品牌</el-button>
        </div>
        <div>
          <el-form-item label="车型-长：" prop="length">
            <el-input placeholder="请输入车型长度" v-model="formData.length">
              <template slot="append">MM</template>
            </el-input>
          </el-form-item>
          <el-form-item label="车型-宽：" prop="width">
            <el-input placeholder="请输入车型宽度" v-model="formData.width">
              <template slot="append">MM</template>
            </el-input>
          </el-form-item>
          <el-form-item label="车型-高：" prop="height">
            <el-input placeholder="请输入车型高度" v-model="formData.height">
              <template slot="append">MM</template>
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="整备质量：" prop="weight">
            <el-input placeholder="请输入整备质量" v-model="formData.weight">
              <template slot="append">KG</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最小离地间隙：" prop="ground_clearance">
            <el-input placeholder="请输入离地间隙" v-model="formData.ground_clearance">
              <template slot="append">MM</template>
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="车型照片：（建议尺寸长300px，宽200px）" prop="img" style="width: 100%;">
            <nf-upload
              :url="uploadUrl"
              :file-preview-list="fileList"
              :multiple="false"
              :upload-success="handleFileSuccess"
              :file-remove="handleFileRemove">
            </nf-upload>
          </el-form-item>
        </div>
      </el-form>
    </nf-form-wrap>
    <nf-dialog
      title="添加品牌"
      :dialog-visible.sync="dialogVisible"
      width="400px"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-form :model="brandForm" :rules="brandRules" ref="brandForm" label-position="top" size="small">
          <el-form-item label="选择一级品牌：" prop="p_id">
            <el-select v-model="brandForm.p_id" filterable placeholder="请选择品牌" >
              <el-option
                v-for="(brand, index) in oneLevelBrand"
                :key="index"
                :label="brand.name"
                :value="brand.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌名称" prop="name">
            <el-input v-model="brandForm.name"></el-input>
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
      isEditing: false,
      edit_id: '',
      dialogVisible: false,
      uploadUrl: api.fileUpload,
      fileList: [],
      formData: {
        name: '',
        brand_id: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        ground_clearance: '',
        image: {
          existing: [],
          uploaded: []
        }
      },
      brandForm: {
        p_id: '',
        name: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入车型名称', trigger: 'blur' }],
        brand_id: [{ required: true, message: '请选择所属品牌', trigger: 'blur' }],
        length: [{validator: this.$valid.isFloatNumber(false), trigger: 'blur'}],
        width: [{validator: this.$valid.isFloatNumber(false), trigger: 'blur'}],
        height: [{validator: this.$valid.isFloatNumber(false), trigger: 'blur'}],
        weight: [{validator: this.$valid.isFloatNumber(false), trigger: 'blur'}],
        ground_clearance: [{validator: this.$valid.isFloatNumber(false), trigger: 'blur'}]
      },
      brandRules: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }]
      },
      twoLevelBrand: [],
      oneLevelBrand: []
    }
  },
  methods: {
    // 获取下拉品牌列表
    searchVehicleBrand(status, level) {
      let data = {
        status: status,
        level: level
      }
      $get(api.searchVehicleBrand, data).then(res => {
        if (level === 1) {
          // 一级品牌
          this.oneLevelBrand = res
        } else {
          // 二级品牌
          this.twoLevelBrand = res
        }
      })
    },
    // 快速添加品牌
    addBrand() {
      this.dialogVisible = true
      this.searchVehicleBrand(1, 1)
    },
    // 确认添加
    clickSureBtn(laoding) {
      laoding(true)
      $post(api.vehicleBrand, this.brandForm).then((res) =>{
        laoding(false)
        this.formData.brand_id = res.id
        this.twoLevelBrand.push({
          id: res.id,
          name: this.brandForm.name
        })
        this.dialogVisible = false
        this.$message.success('添加成功')
      }).catch(() => {
        laoding(false)
      })
    },
    // 上传成功
    handleFileSuccess(response, file) {
      this.formData.image.uploaded = [response.file]
      this.formData.image.existing = []
      this.fileList = []
      this.fileList.push(file.url)
    },
    // 删除图片
    handleFileRemove() {
      this.fileList = []
      this.formData.image = {
        uploaded: [],
        existing: []
      }
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.vehicle}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() =>{
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.vehicle, this.formData).then(() =>{
              this.$message.success('添加成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          }
        } else {
          return false;
        }
      })
    },
    // 获取商品车详情
    getVehicleDetail(id) {
      $get(`${api.vehicle}/${id}`).then(res => {
        _.forIn(res, (value, key) => {
          if (value === 0) {
            res[key] = ''
          }
        })
        this.formData = {
          name: res.name,
          brand_id: res.brand_id,
          length: res.length,
          width: res.width,
          height: res.height,
          weight: res.weight,
          ground_clearance: res.ground_clearance,
          image: res.image
        }
        if (res.image.existing.length > 0) {
          this.fileList = [`${api.vehicle}/${this.edit_id}/image?${res.update_time}`]
        } else {
          this.fileList = []
        }
      })
    }
  },
  created() {
    this.searchVehicleBrand(1, 2)
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      this.getVehicleDetail(this.edit_id)
    }
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
