<template>
  <div>
    <el-form class="box_260" :model="formData" :rules="rules" ref="formData" inline label-position="top">
      <div class="clearfix">
        <el-form-item label="类型：" prop="type">
          <el-radio v-for="(item, index) in client_type" :key="index" v-model="formData.type"
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
        <el-form-item label="管理员手机号" prop="admin_mobile">
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
      <div class="department-box">
        <el-form-item label="当前所属部门：" prop="department_id" style="width: 100%">
          <el-tag v-if="formData.department_display">{{formData.department_display}}</el-tag>
          <el-button type="primary" @click="dialogDepartment = true">选择部门</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!-- 选择部门 -->
    <nf-dialog-department :appendToBody="true" v-if="dialogDepartment" :default-department="defaultDepartment"
      :dialog-department.sync="dialogDepartment" ref="nfDialogDepartment" @selectData="getSelectData" />
  </div>
</template>

<script>
export default {
  name: 'nfQuickClient',
  data() {
    return {
      getDet: false,
      client_type: [],
      dialogVisible: false,
      dialogDepartment: false,
      defaultDepartment: {
        id: '',
        name: ''
      },
      formData: {
        type: 'enterprise', // 默认是企业，写死的
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
        admin_name: [{
          required: true,
          message: '请输入管理员姓名',
          trigger: 'blur'
        }],
        admin_mobile: [{
          required: true,
          validator: this.$valid.isPhone(),
          trigger: 'blur'
        }],
        department_id: [{
          required: true,
          message: '请选择所属部门',
          trigger: 'blur'
        }]
      },
      uploadUrl: api.fileUpload,
      fileList: [],
      treeData: [],
      selectData: {
        id: '',
        name: ''
      },
      defaultExpandedKeys: [],
      currentNodeKey: []
    }
  },
  props: {
    isAddQuickly: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.getType()
  },
  methods: {
    // 获取选择的部门信息
    getSelectData(val) {
      this.defaultDepartment = val
      this.formData.department_id = val.id
      this.formData.department_display = val.name
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
    onSaveBtnClick() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          $post(api.client, this.formData).then(res => {
            this.$message.success('添加成功')
            this.$emit('update:dialogVisible1', false)
            let formData = _.cloneDeep(this.formData)
            this.$emit('update:clientName', formData.name)
            this.$emit('update:clientId', res.id)
            this.resetForm()
          }).catch(() => {
            this.$emit('update:loading', false)
          })
        } else {
          return false;
        }
      })
    },
    resetForm() {
      this.$refs['formData'].resetFields();
      this.formData.type= 'enterprise'
      this.formData.department_id = ''
      this.formData.department_display = ''
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

</style>
