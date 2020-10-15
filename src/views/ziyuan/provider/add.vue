<template>
  <div>
    <el-form class="box_260" :model="formData" :rules="rules" inline ref="formData" label-position="top">
      <nf-form-wrap title="承运方管理" :is-loading="btnLoading" :on-save-btn-click="onSaveBtnClick">
        <div class="clearfix">
          <el-form-item label="类型：" prop="type">
            <el-radio :disabled="isEditing" v-for="(item, index) in client_type" :key="index" v-model="formData.type"
              :label="item.key" @change="changeType">
              {{item.value}}</el-radio>
          </el-form-item>
        </div>
        <div class="clearfix type1" v-if="formData.type==='enterprise'">
          <el-form-item label="企业名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入企业名称"></el-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="id_card">
            <el-input v-model="formData.id_card" placeholder="请输入统一社会信用代码"></el-input>
          </el-form-item>
          <el-form-item label="管理员姓名" prop="admin_name">
            <el-input v-model="formData.admin_name" placeholder="请输入管理员姓名"></el-input>
          </el-form-item>
          <el-form-item label="管理员手机号">
            <el-input v-model="formData.admin_mobile" placeholder="请输入管理员手机号"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix type1" v-if="formData.type==='personal'">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" @blur="changeName"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="admin_mobile">
            <el-input v-model="formData.admin_mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="id_card">
            <el-input v-model="formData.id_card" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </div>
      </nf-form-wrap>
      <nf-form-wrap title="部门管理" :show-footer="false">
        <div class="department-box">
          <el-form-item label="当前所属部门：" prop="department_id" style="width: 100%">
            <el-tag v-if="formData.department_display">{{formData.department_display}}</el-tag>
            <el-button type="primary" @click="dialogDepartment = true">选择部门</el-button>
          </el-form-item>
        </div>
      </nf-form-wrap>
      <nf-form-wrap class="photos" title="附件信息" :on-save-btn-click="onSaveBtnClick" :is-loading="btnLoading"
        v-if="formData.type==='enterprise'">
        <el-form-item label="营业执照" prop="image">
          <nf-upload :url="uploadUrl" :file-preview-list="fileList" :upload-success="handleFileSuccess"
            :file-remove="handleFileRemove">
          </nf-upload>
        </el-form-item>
      </nf-form-wrap>
    </el-form>
    <!-- 选择部门 -->
    <nf-dialog-department
      v-if="dialogDepartment"
      :default-department="defaultDepartment"
      :dialog-department.sync="dialogDepartment"
      ref="nfDialogDepartment"
      @selectData="getSelectData"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getDet: false,
      client_type: [],
      isEditing: false,
      dialogVisible: false,
      dialogDepartment: false,
      defaultDepartment: {id: '', name: ''},
      formData: {
        type: 'enterprise', // 默认是企业，写死的
        update_time: '',
        name: '',
        id_card: '',
        admin_name: '',
        admin_mobile: '',
        department_id: '',
        department_display: '',
        image: {
          uploaded: {
            business_license: []
          },
          existing: {
            business_license: []
          }
        }
      },
      rules: {
        name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        id_card: [{
          required: true,
          message: '请输入身份证号/统一社会信用代码',
          trigger: 'blur'
        }],
        admin_mobile: [{ required: true, validator: this.$valid.isPhone(), trigger: 'blur' }],
        department_id: [{ required: true, message: '请选择所属部门', trigger: 'blur' }]
      },
      uploadUrl: api.fileUpload,
      fileList: [],
      treeData: [],
      selectData: {id: '', name: ''},
      defaultExpandedKeys: [],
      currentNodeKey: []
    }
  },
  created() {
    this.getType()
    this.edit_id = this.$route.query.id;
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  },
  methods: {
    // 获取选择的部门信息
    getSelectData(val) {
      this.defaultDepartment = val
      this.formData.department_id = val.id
      this.formData.department_display = val.name
    },
    // 编辑获取详情
    getDetail(id) {
      $get(`${api.provider}/${id}`).then(res => {
        if (res.admin_mobile === 0) {
          res.admin_mobile = ''
        }
        res.images = JSON.parse(JSON.stringify(res.image));
        this.formData = res;
        delete this.formData.image;
        this.$set(this.formData, 'image', {
          uploaded: {
            business_license: []
          },
          existing: {
            business_license: res.images.business_license ? res.images.business_license : []
          }
        });
        // 处理图片
        if (res.images.business_license) {
          res.images.business_license.forEach(item => {
            this.fileList.push(`${api.provider}/${this.edit_id}/type/business_license/image/${item}?${this.formData.update_time}`)
          })
        }
        this.getDet = true;
      })
    },
    // 获取类型和图片类型
    getType() {
      $get(api.partner_enums_by_type, {
        type: {
          'client_type': true
        }
      }).then(res => {
        this.client_type = res.client_type;
      })
    },
    // 改变类型重置formdata
    changeType() {
      this.formData.name = '';
      this.formData.id_card = '';
      this.formData.admin_name = '';
      this.formData.admin_mobile = '';
      this.formData.image = {
        uploaded: {
          business_license: []
        },
        existing: {
          business_license: []
        }
      };
    },
    // 改变个人名称，给admin_name赋值
    changeName() {
      if (this.formData.type === 'personal') this.formData.admin_name = this.formData.name;
    },
    // 上传成功
    handleFileSuccess(response, file) {
      this.formData.image.uploaded.business_license.push(response.file);
      this.fileList.push(file.url)
    },
    // 删除图片
    handleFileRemove(id) {
      this.formData.image.uploaded.business_license = _.pull(this.formData.image.uploaded.business_license, id);
      this.formData.image.existing.business_license = _.pull(this.formData.image.existing.business_license, id);
    },
    // 保存
    onSaveBtnClick(loading) {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          loading(true);
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.provider}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() => {
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false);
            })
          } else {
            $post(api.provider, this.formData).then(() => {
              this.$message.success('添加成功')
              this.$router.back()
            }).catch(() => {
              loading(false);
            })
          }
        } else {
          return false;
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  .nf-form-wrap {
    margin-bottom: 20px !important;
  }

  .nf-form-wrap:last-child {
    margin-bottom: 80px !important;
  }

  .photos {
    width: 100%;
    .el-form-item {
      width: 100%;
    }
  }

</style>
