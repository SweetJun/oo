<template>
  <div>
    <el-form class="box_260" :model="ruleForm" ref="ruleForm" label-position="top" :rules="rules">
      <nf-form-wrap title="基础信息" :show-footer="false">
        <div class="clearfix">
          <el-form-item label="车牌号" prop="number">
            <el-input v-model="ruleForm.number" placeholder="请输入车牌号"></el-input>
          </el-form-item>
          <el-form-item label="车辆类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择车辆类型">
              <el-option v-for="item in typeList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检验有效期止" prop="effect_date">
            <el-date-picker type="datetime" v-model="ruleForm.effect_date" format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="强制报废期止" prop="invalid_date">
            <el-date-picker type="datetime" v-model="ruleForm.invalid_date" format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </nf-form-wrap>
      <nf-form-wrap title="部门管理" :show-footer="false">
        <div class="department-box">
          <el-form-item label="当前所属部门：" prop="department_id" style="width: 100%">
            <el-tag v-if="ruleForm.department_display">{{ruleForm.department_display}}</el-tag>
            <el-button type="primary" @click="dialogDepartment = true">选择部门</el-button>
          </el-form-item>
        </div>
      </nf-form-wrap>
      <nf-form-wrap title="加油卡管理" :show-footer="false">
        <oilcardManagement ref="oilcardManagement" :mode="'tractor'" :detailCard="detailCard"></oilcardManagement>
      </nf-form-wrap>
      <nf-form-wrap title="附件信息" :on-save-btn-click="onSaveBtnClick">
        <div class="clearfix">
          <el-form-item label="车辆照片" prop="image">
            <nf-upload :url="uploadUrl" :file-preview-list="fileList_t"
              :upload-success="(res,file) => handleFileSuccess(res,file,1)"
              :file-remove="(id) => handleFileRemove(id, 1)">
            </nf-upload>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="行驶证照片" prop="image">
            <nf-upload :url="uploadUrl" :file-preview-list="fileList_v"
              :upload-success="(res,file) => handleFileSuccess(res,file,2)"
              :file-remove="(id) => handleFileRemove(id, 2)">
            </nf-upload>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="道路运输证照片" prop="image">
            <nf-upload :url="uploadUrl" :file-preview-list="fileList_r"
              :upload-success="(res,file) => handleFileSuccess(res,file,3)"
              :file-remove="(id) => handleFileRemove(id, 3)">
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
import oilcardManagement from '@/components/nf-views/oilcardManagement'
export default {
  data() {
    return {
      relatedOilcardShow: false,
      dialogVisible: false,
      oilCard: '',
      oilcardOptions: [],
      oilcard_list: [],
      typeList: [],
      detailCard: [],
      dialogDepartment: false,
      defaultDepartment: {id: '', name: ''},
      ruleForm: {
        name: '',
        update_time: '',
        type: 'own',
        effect_date: '',
        invalid_date: '',
        department_id: '',
        department_display: '',
        image: {
          uploaded: {
            truck_unit: [],
            vehicle_license: [],
            road_transportation_certificate: []
          },
          existing: {
            truck_unit: [],
            vehicle_license: [],
            road_transportation_certificate: []
          }
        }
      },
      rules: {
        number: [{ required: true, validator: this.$valid.isCarNumber(), trigger: 'blur' }],
        department_id: [{ required: true, message: '请选择所属部门', trigger: 'blur' }]
      },
      uploadUrl: api.fileUpload,
      fileList_t: [],
      fileList_v: [],
      fileList_r: [],
      treeData: [],
      selectData: {id: '', name: ''},
      defaultExpandedKeys: [],
      currentNodeKey: []
    }
  },
  components: {
    oilcardManagement
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
      this.ruleForm.department_id = val.id
      this.ruleForm.department_display = val.name
    },
    // 编辑获取详情
    getDetail(id) {
      $get(`${api.tractor}/${id}`).then(res => {
        this.ruleForm = JSON.parse(JSON.stringify(res));
        // 回显油卡关联
        this.detailCard = res.oil_card;
        // 处理图片
        delete this.ruleForm.image;
        this.$set(this.ruleForm, 'image', {
          uploaded: {
            truck_unit: [],
            vehicle_license: [],
            road_transportation_certificate: []
          },
          existing: {
            truck_unit: [],
            vehicle_license: [],
            road_transportation_certificate: []
          }
        })
        res.image.truck_unit.forEach(item => {
          this.fileList_t.push(`${api.truck_unit}/${this.edit_id}/image/${item}?${this.ruleForm.update_time}`)
          this.ruleForm.image.existing.truck_unit.push(item);
        })
        res.image.vehicle_license.forEach(item => {
          this.fileList_v.push(`${api.truck_unit}/${this.edit_id}/image/${item}?${this.ruleForm.update_time}`)
          this.ruleForm.image.existing.vehicle_license.push(item);
        })
        res.image.road_transportation_certificate.forEach(item => {
          this.fileList_r.push(`${api.truck_unit}/${this.edit_id}/image/${item}?${this.ruleForm.update_time}`)
          this.ruleForm.image.existing.road_transportation_certificate.push(item);
        })
      })
    },
    // 保存
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let oil_card = [];
          this.$refs.oilcardManagement.oilcard_list.forEach(item => {
            oil_card.push({
              "oil_card_id": item.id,
              "is_default": this.$refs.oilcardManagement.default_o === item.id ? true : false
            })
          })
          this.$set(this.ruleForm, 'oil_card', oil_card);
          loading(true);
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.tractor}/${this.edit_id}`
            $put(apiUrl, this.ruleForm).then(() => {
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false);
            })
          } else {
            $post(api.tractor, this.ruleForm).then(() => {
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
    },
    // 获取车辆类型下拉
    async getType() {
      this.typeList = await $get(api.truck_unit_type_options);
    },
    // 上传成功
    handleFileSuccess(response, file, type) {
      if (type === 1) {
        this.ruleForm.image.uploaded.truck_unit.push(response.file)
        this.fileList_t.push(file.url)
      } else if (type === 2) {
        this.ruleForm.image.uploaded.vehicle_license.push(response.file)
        this.fileList_v.push(file.url)
      } else if (type === 3) {
        this.ruleForm.image.uploaded.road_transportation_certificate.push(response.file)
        this.fileList_r.push(file.url)
      }
    },
    // 删除图片
    handleFileRemove(id, type) {
      if (type === 1) {
        this.ruleForm.image.uploaded.truck_unit = this.ruleForm.image.uploaded.truck_unit.filter(item => Number(
          item) !== Number(id));
        this.ruleForm.image.existing.truck_unit = this.ruleForm.image.existing.truck_unit.filter(item => Number(
          item) !== Number(id));
      } else if (type === 2) {
        this.ruleForm.image.uploaded.vehicle_license = this.ruleForm.image.uploaded.vehicle_license.filter(item =>
          Number(item) !== Number(id));
        this.ruleForm.image.existing.vehicle_license = this.ruleForm.image.existing.vehicle_license.filter(item =>
          Number(item) !== Number(id));
      } else if (type === 3) {
        this.ruleForm.image.uploaded.road_transportation_certificate = this.ruleForm.image.uploaded
          .road_transportation_certificate.filter(item => Number(item) !== Number(id));
        this.ruleForm.image.existing.road_transportation_certificate = this.ruleForm.image.existing
          .road_transportation_certificate.filter(item => Number(item) !== Number(id));
      }
    }
  }
}

</script>

<style lang="scss" scoped>
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

  .box_260 {
    /deep/ .el-form-item__label {
      height: 20px;
      line-height: 20px;
      padding: 0 0 7px !important;
      box-sizing: content-box;
    }

    /deep/ .el-input {
      width: 260px;
    }
  }

  .clearfix {
    .el-form-item {
      float: left;
      margin-right: 10px;
    }
  }

  .el-form .el-form-item:last-child {
    margin-bottom: 18px;
  }

</style>
