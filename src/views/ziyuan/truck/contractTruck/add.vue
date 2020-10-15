<template>
  <div>
    <el-form
      :model="formData"
      ref="ruleForm"
      :rules="formRules"
      label-position="top"
      inline>
      <nf-form-wrap title="基础信息" :show-footer="false">
        <el-form-item label="承运方名称：" prop="partner_id">
          <el-select
            v-model="formData.partner_id"
            filterable
            remote
            clearable
            :loading="loading"
            :remote-method="getCarrierList"
            placeholder="请选择承运方" >
            <el-option
              v-for="(bank, index) in carrierList"
              :key="index"
              :label="bank.value"
              :value="bank.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驾驶员姓名：" prop="driver_name">
          <el-input v-model="formData.driver_name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员手机号：" prop="mobile_phone">
          <el-input v-model.number="formData.mobile_phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="车牌号：" prop="tractor_number">
          <el-input v-model="formData.tractor_number" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="挂车车牌号：" prop="trailer_number">
          <el-input v-model="formData.trailer_number" placeholder="请输入挂车车牌号"></el-input>
        </el-form-item>
      </nf-form-wrap>
      <nf-form-wrap
        v-if="roles.truck_contract_image_list"
        class="upload-container"
        title="附件信息"
        :on-save-btn-click="onSaveBtnClick">
        <el-form-item
          v-for="(item, index) in uploadData"
          :key="index"
          :label="item.label">
          <nf-upload
            :url="uploadUrl"
            :disabled="!roles.truck_contract_image_edit"
            :file-preview-list="item.fileList"
            :limit="2"
            :upload-success="(res, file, fileList) => {handleFileSuccess(res, file, fileList, item)}"
            :file-remove="handleFileRemove">
          </nf-upload>
        </el-form-item>
      </nf-form-wrap>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      privileges: [
        'truck_contract_image_list',
        'truck_contract_image_edit'
      ],
      roles: {
        truck_contract_image_list: false,
        truck_contract_image_edit: false
      },
      isEditing: false,
      loading: false,
      dialogVisible: true,
      carrierList: [],
      uploadUrl: api.fileUpload,
      uploadData: [
        {label: '上传车辆行驶证：', type: 'tractor_license', fileList: []},
        {label: '上传挂车行驶证：', type: 'trailer_license', fileList: []},
        {label: '上传驾驶证照片：', type: 'driver_license', fileList: []},
        {label: '上传委托书：', type: 'power_of_attorney', fileList: []}
      ],
      formData: {
        partner_id: '',
        driver_name: '',
        mobile_phone: '',
        tractor_number: '',
        trailer_number: '',
        image: {
          existing: {
            tractor_license: [],
            trailer_license: [],
            driver_license: [],
            power_of_attorney: []
          },
          uploaded: {
            tractor_license: [],
            trailer_license: [],
            driver_license: [],
            power_of_attorney: []
          }
        }
      },
      formRules: {
        partner_id: [{ required: true, message: '请选择承运方', trigger: 'change' }],
        driver_name: [{ required: true, message: '请输入驾驶员姓名', trigger: 'blur' }],
        mobile_phone: [{ required: true, validator: this.$valid.isPhone(), trigger: 'blur' }],
        tractor_number: [{ required: true, validator: this.$valid.isCarNumber(), trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取承运方下拉列表
    getCarrierList(query) {
      if (query !== '') {
        this.loading = true
        $get(api.providerSearchByName, {name: query}).then(res => {
          this.carrierList = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.carrierList = []
      }
    },
    // 上传成功
    handleFileSuccess(response, file, fileList, item) {
      this.formData.image.uploaded[item.type].push(response.file)
      item.fileList.push(file.url)
    },
    // 删除图片
    handleFileRemove(id) {
      let uploaded = this.formData.image.uploaded
      let existing = this.formData.image.existing
      _.forIn(uploaded, (val, key) => {
        _.pull(uploaded[key], id)
      })
      _.forIn(existing, (val, key) => {
        _.pull(existing[key], id)
      })
    },
    // 编辑时获取详情信息
    getDetail(id) {
      $get(`${api.truckContract}/${id}`).then(res => {
        this.formData = res
        this.carrierList = [{
          key: res.partner_id,
          value: res.partner_name
        }]
        let existing = res.image.existing
        _.forIn(existing, (val, key) => {
          if (existing[key].length > 0) {
            existing[key].forEach((item) => {
              this.uploadData.forEach(uploadItem => {
                if (uploadItem.type === key) {
                  let imgUrl = `${api.truckContract}/${this.edit_id}/image/${item}`
                  uploadItem.fileList.push(imgUrl)
                }
              })
            })
          } else {
            this.uploadData.forEach(uploadItem => {
              if (uploadItem.type === key) {
                uploadItem.fileList = []
              }
            })
          }
        })
      })
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.truckContract}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() =>{
              loading(false)
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.truckContract, this.formData).then(() =>{
              loading(false)
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
    // 权限验证
    getPrivileges() {
      this.checkPrivileges(this.privileges).then(res => {
        this.roles = res ? res : {}
      })
    }
  },
  created() {
    this.getPrivileges()
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload-container{
    .el-form-item{
      width: 50%;
      margin: 0;
      padding: 0 20px 20px 0;
      box-sizing: border-box;
    }
  }

</style>
