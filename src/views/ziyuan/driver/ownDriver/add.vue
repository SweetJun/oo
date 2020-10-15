<template>
  <div>
    <el-form class="box_260" :model="formData" ref="ruleForm" :rules="formRules" label-position="top" inline>
      <nf-form-wrap title="基础信息" :show-footer="false">
        <el-form-item label="驾驶员类型：" prop="type">
          <el-select v-model="formData.type" placeholder="请选择驾驶员类型">
            <el-option v-for="item in driver_type_options" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驾驶员姓名：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入驾驶员姓名"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员手机号：" prop="mobile">
          <el-input v-model="formData.mobile" placeholder="请输入驾驶员手机号"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员身份证号：" prop="id_card">
          <el-input v-model="formData.id_card" placeholder="请输入驾驶员身份证号"></el-input>
        </el-form-item>
        <el-form-item label="驾驶证有效期至：" prop="license_effect_date">
          <el-date-picker type="datetime" v-model="formData.license_effect_date" format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择驾驶证有效期至">
          </el-date-picker>
        </el-form-item>
      </nf-form-wrap>

      <associated-settler
        @updateSettlerId="getSettler"
        :driverInfo="driverInfo"
        type="driver"
        v-if="roles.driver_settlement_account&&showSettler"
        :settlerInfo.sync="formData.settlement_account_ids"
      />
      <nf-form-wrap title="部门管理" :show-footer="false">
        <div class="department-box">
          <el-form-item label="当前所属部门：" prop="department_id" style="width: 100%">
            <el-tag v-if="formData.department_display">{{formData.department_display}}</el-tag>
            <el-button type="primary" @click="dialogDepartment = true">选择部门</el-button>
          </el-form-item>
        </div>
      </nf-form-wrap>
      <nf-form-wrap title="附件信息" :on-save-btn-click="onSaveBtnClick">
        <div class="clearfix">
          <el-form-item label="身份证照片" prop="image" style="width:100%;">
            <nf-upload :url="uploadUrl" :file-preview-list="fileList_s"
              :upload-success="(res,file) => handleFileSuccess(res,file,1)"
              :file-remove="(id) => handleFileRemove(id, 1)">
            </nf-upload>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="驾驶证照片" prop="image" style="width:100%;">
            <nf-upload :url="uploadUrl" :file-preview-list="fileList_j"
              :upload-success="(res,file) => handleFileSuccess(res,file,2)"
              :file-remove="(id) => handleFileRemove(id, 2)">
            </nf-upload>
          </el-form-item>
        </div>
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
import associatedSettler from "@/components/nf-views/nf-associated-settler";
export default {
  components: { associatedSettler },
  data() {
    return {
      dialogDepartment: false,
      defaultDepartment: {id: '', name: ''},
      dialogVisible: false,
      isEditing: false,
      loading: false,
      relatedOilcardShow: false,
      createOilcardShow: false,
      uploadUrl: api.fileUpload,
      default_o: false,
      fileList_s: [], // 身份证照片
      fileList_j: [], // 驾驶证照片
      driver_type_options: [], // 驾驶员类型
      oilCard: '', // 选中的id
      formData: {
        id: '',
        name: '',
        mobile: '',
        id_card: '',
        type: 'own',
        department_id: '',
        department_display: '',
        settlement_account_ids: [],
        image: {
          uploaded: {
            id_card: [],
            driving_license: []
          },
          existing: {
            id_card: [],
            driving_license: []
          }
        }
      },
      formRules: {
        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        mobile: [{ required: true, validator: this.$valid.isPhone(), trigger: 'blur' }],
        id_card: [{ required: true, validator: this.$valid.isIdCard(), trigger: 'blur' }],
        department_id: [{ required: true, message: '请选择所属部门', trigger: 'blur' }]
      },
      treeData: [],
      selectData: {id: '', name: ''},
      defaultExpandedKeys: [],
      currentNodeKey: [],
      showSettler: false,
      settlement_account_ids: [],
      privileges: ["driver_settlement_account"],
      roles: {
        driver_settlement_account: false
      }
    }
  },
  computed: {
    driverInfo: {
      get() {
        return {
          driver_id: this.formData.id,
          driver_name: this.formData.name,
          mobile_phone: this.formData.mobile,
          id_card: this.formData.id_card
        };
      }
    }
  },
  methods: {
    getSettler(data) {
      this.settlement_account_ids = data;
    },
    // 获取选择的部门信息
    getSelectData(val) {
      this.defaultDepartment = val
      this.formData.department_id = val.id
      this.formData.department_display = val.name
    },
    // 上传成功
    handleFileSuccess(response, file, type) {
      if (type === 1) {
        this.formData.image.uploaded.id_card.push(response.file)
        this.fileList_s.push(file.url)
      } else if (type === 2) {
        this.formData.image.uploaded.driving_license.push(response.file)
        this.fileList_j.push(file.url)
      }
    },
    // 删除图片
    handleFileRemove(id, type) {
      if (type === 1) {
        this.formData.image.uploaded.id_card = this.formData.image.uploaded.id_card.filter(item => Number(
          item) !== Number(id));
        this.formData.image.existing.id_card = this.formData.image.existing.id_card.filter(item => Number(
          item) !== Number(id));
      } else if (type === 2) {
        this.formData.image.uploaded.driving_license = this.formData.image.uploaded.driving_license.filter(item =>
          Number(item) !== Number(id));
        this.formData.image.existing.driving_license = this.formData.image.existing.driving_license.filter(item =>
          Number(item) !== Number(id));
      }
    },
    // 编辑时获取详情信息
    getDetail(id) {
      $get(`${api.driver}/${id}`).then(res => {
        this.formData = _.cloneDeep(res)
        // 处理图片
        res.image.id_card.forEach(item => {
          this.fileList_s.push(`${api.driver}/${this.edit_id}/image/${item}`)
        })
        res.image.driving_license.forEach(item => {
          this.fileList_j.push(`${api.driver}/${this.edit_id}/image/${item}`)
        })
        delete this.formData.image;
        this.$set(this.formData, 'image', {
          uploaded: {
            id_card: [],
            driving_license: []
          },
          existing: {
            id_card: res.image.id_card,
            driving_license: res.image.driving_license
          }
        });
        this.showSettler = true;
      })
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.formData.mobile = Number(this.formData.mobile);
          loading(true)

          let postParams = _.cloneDeep(this.formData);
          delete postParams.settlement_account_ids;
          postParams.settlement_account_ids = this.settlement_account_ids;

          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.driver}/${this.edit_id}`
            $put(apiUrl, postParams).then(() => {
              loading(false)
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.driver, postParams).then(() => {
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
        this.roles = res ? res : {};
      });
    }
  },
  created() {
    this.getPrivileges();
    // 驾驶员类型
    $get(api.driver_type_options, {}).then(res => {
      this.driver_type_options = res
    })
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }else{
      this.showSettler = true;
    }
  }
}

</script>

<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
  }

  .el-button--text {
    color: #f56c6c;
    padding: 5px 0;

    &:hover {
      color: #f78989;
    }

    &:active {
      color: #dd6161;
    }
  }

  .person-item {
    width: 268px;
    height: 162px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 4px 4px 8px 0px rgba(237, 242, 251, 1);
    border-radius: 8px;
    border: 1px solid rgba(231, 235, 241, 1);
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 15px 15px 15px 20px;
    box-sizing: border-box;

    .top {
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(32, 44, 85, 1);
        line-height: 22px;
      }

      .cancel {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(245, 108, 109, 1);
        line-height: 17px;
      }

    }

    .middle {
      .bank_card {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(120, 127, 149, 1);
        line-height: 20px;
        letter-spacing: 1px;
        margin-bottom: 10px;
      }

      .bank {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(120, 127, 149, 1);
        line-height: 17px;
        margin-bottom: 15px;
      }

      .oil_card {
        margin-top: 25px;
        margin-bottom: 39px;
      }
    }

    .bottom,
    .oilcard-top {
      display: flex;
      justify-content: space-between;
    }
  }

  .related-settler {
    .settler-type {
      margin-bottom: 18px;
    }

    margin-top: 20px;

    .add-settler {
      margin-left: 20px;
    }
  }

</style>
