<template>
  <div>
    <el-form :model="formData" ref="ruleForm" :rules="formRules" label-position="top" inline>
      <nf-form-wrap title="基础信息" :show-footer="false" required>
        <el-form-item label="驾驶员姓名：" prop="driver_name">
          <el-input v-model="formData.driver_name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员手机号：" prop="mobile_phone">
          <el-input v-model.number="formData.mobile_phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员身份证号：" prop="id_card">
          <el-input v-model="formData.id_card" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="车牌号：" prop="tractor_number">
          <el-input v-model="formData.tractor_number" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="挂车车牌号：" prop="trailer_number">
          <el-input v-model="formData.trailer_number" placeholder="请输入挂车车牌号"></el-input>
        </el-form-item>
      </nf-form-wrap>
      <associated-settler
        @updateSettlerId="getSettler"
        :driverInfo="driverInfo"
        type="truck_personal"
        v-if="roles.truck_personal_settlement_account&&showSettler"
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
      <nf-form-wrap
        v-if="roles.truck_personal_image_list"
        class="upload-container"
        title="附件信息"
        :on-save-btn-click="onSaveBtnClick"
      >
        <el-form-item v-for="(item, index) in uploadData" :key="index" :label="item.label">
          <nf-upload
            :url="uploadUrl"
            :disabled="!roles.truck_personal_image_edit"
            :file-preview-list="item.fileList"
            :limit="2"
            :upload-success="(res, file) => {handleFileSuccess(res, file, fileList, item)}"
            :file-remove="handleFileRemove"
          ></nf-upload>
        </el-form-item>
      </nf-form-wrap>
    </el-form>
    <!-- 选择部门 -->
    <nf-dialog-department
      v-if="dialogDepartment"
      :default-department="defaultDepartment"
      :dialog-department.sync="dialogDepartment"
      ref="nfDialogDepartment"
      @selectData="getSelectData"
    />
  </div>
</template>

<script>
import associatedSettler from "@/components/nf-views/nf-associated-settler";
export default {
  components: { associatedSettler },
  data() {
    return {
      privileges: ["truck_personal_image_list", "truck_personal_image_edit", "truck_personal_settlement_account"],
      roles: {
        truck_personal_image_list: false,
        truck_personal_image_edit: false,
        truck_personal_settlement_account: false
      },
      showSettler: false,
      settlement_account_ids: [],
      dialogDepartment: false,
      defaultDepartment: { id: "", name: "" },
      isEditing: false,
      loading: false,
      dialogVisible: false,
      uploadUrl: api.fileUpload,
      uploadData: [
        { label: "上传车辆行驶证：", type: "tractor_license", fileList: [] },
        { label: "上传挂车行驶证：", type: "trailer_license", fileList: [] },
        { label: "上传驾驶证照片：", type: "driver_license", fileList: [] },
        { label: "上传身份证：", type: "id_card", fileList: [] }
      ],
      formData: {
        id: "",
        driver_name: "",
        mobile_phone: "",
        id_card: "",
        tractor_number: "",
        trailer_number: "",
        department_id: "",
        department_display: "",
        settlement_account_ids: [],
        image: {
          existing: {
            tractor_license: [],
            trailer_license: [],
            driver_license: [],
            id_card: []
          },
          uploaded: {
            tractor_license: [],
            trailer_license: [],
            driver_license: [],
            id_card: []
          }
        }
      },
      formRules: {
        driver_name: [
          { required: true, message: "请输入驾驶员姓名", trigger: "blur" }
        ],
        mobile_phone: [
          { required: true, validator: this.$valid.isPhone(), trigger: "blur" }
        ],
        id_card: [
          { required: true, validator: this.$valid.isIdCard(), trigger: "blur" }
        ],
        tractor_number: [
          {
            required: true,
            validator: this.$valid.isCarNumber(),
            trigger: "blur"
          }
        ],
        department_id: [
          { required: true, message: "请选择所属部门", trigger: "blur" }
        ]
      },
      treeData: [],
      selectData: { id: "", name: "" },
      defaultExpandedKeys: [],
      currentNodeKey: []
    };
  },
  computed: {
    driverInfo: {
      get() {
        return {
          driver_id: this.formData.id,
          driver_name: this.formData.driver_name,
          mobile_phone: this.formData.mobile_phone,
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
      this.defaultDepartment = val;
      this.formData.department_id = val.id;
      this.formData.department_display = val.name;
    },
    // 上传成功
    handleFileSuccess(response, file, fileList, item) {
      this.formData.image.uploaded[item.type].push(response.file);
      item.fileList.push(file.url);
    },
    // 删除图片
    handleFileRemove(id) {
      let uploaded = this.formData.image.uploaded;
      let existing = this.formData.image.existing;
      _.forIn(uploaded, (val, key) => {
        _.pull(uploaded[key], id);
      });
      _.forIn(existing, (val, key) => {
        _.pull(existing[key], id);
      });
    },
    // 编辑时获取详情信息
    getDetail(id) {
      $get(`${api.truckPersonal}/${id}`).then(res => {
        this.formData = res;
        let existing = res.image.existing;
        _.forIn(existing, (val, key) => {
          if (existing[key].length > 0) {
            existing[key].forEach(item => {
              this.uploadData.forEach(uploadItem => {
                if (uploadItem.type === key) {
                  let imgUrl = `${api.truckPersonal}/${this.edit_id}/image/${item}`;
                  uploadItem.fileList.push(imgUrl);
                }
              });
            });
          } else {
            this.uploadData.forEach(uploadItem => {
              if (uploadItem.type === key) {
                uploadItem.fileList = [];
              }
            });
          }
        });
        this.showSettler = true;
      });
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          loading(true);
          let postParams = _.cloneDeep(this.formData);
          delete postParams.settlement_account_ids;
          postParams.settlement_account_ids = this.settlement_account_ids;

          if (this.isEditing) {
            // 判断 编辑 和 新增
            let apiUrl = `${api.truckPersonal}/${this.edit_id}`;
            $put(apiUrl, postParams)
              .then(() => {
                loading(false);
                this.$message.success("编辑成功");
                this.$router.back();
              })
              .catch(() => {
                loading(false);
              });
          } else {
            $post(api.truckPersonal, postParams)
              .then(() => {
                loading(false);
                this.$message.success("添加成功");
                this.$router.back();
              })
              .catch(() => {
                loading(false);
              });
          }
        } else {
          return false;
        }
      });
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
    this.edit_id = this.$route.query.id;
    this.isEditing = this.edit_id ? true : false;
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id);
    }else{
      this.showSettler = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-container {
  .el-form-item {
    width: 50%;
    margin: 0;
    padding: 0 20px 20px 0;
    box-sizing: border-box;
  }
}
</style>
