<template>
  <div>
    <nf-dialog
      title="快捷添加运力"
      :dialog-visible.sync="dialogAddTruck"
      width="580px"
      @close="dialogClose"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-form :model="formData" :rules="formRules" inline ref="formData" label-position="top">
          <el-form-item label="承运方：" prop="partner_id" v-if="truckType === 'contract'">
            <nf-select
              placeholder="请选择承运方"
              search-key="provider_name"
              :value.sync="formData.partner_id">
            </nf-select>
          </el-form-item>
          <el-form-item label="驾驶员：" prop="driver_id" v-if="truckType === 'own'">
            <nf-select
              placeholder="请选择驾驶员"
              search-key="driver_own_name_or_mobile"
              :value.sync="formData.driver_id">
            </nf-select>
          </el-form-item>
          <el-form-item label="车牌号：" prop="tractor_id" v-if="truckType === 'own'">
            <nf-select
              placeholder="请选择车牌号"
              search-key="tractor_number"
              :value.sync="formData.tractor_id">
            </nf-select>
          </el-form-item>
          <el-form-item label="挂车牌号：" prop="trailer_id" v-if="truckType === 'own'">
            <nf-select
              placeholder="请选择挂车牌号"
              search-key="trailer_number"
              :value.sync="formData.trailer_id">
            </nf-select>
          </el-form-item>
          <el-form-item label="驾驶员姓名：" prop="driver_name" v-if="truckType !== 'own'">
            <el-input v-model="formData.driver_name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="驾驶员手机号：" prop="mobile_phone" v-if="truckType !== 'own'">
            <el-input v-model.number="formData.mobile_phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="驾驶员身份证号：" prop="id_card" v-if="truckType === 'personal'">
            <el-input v-model="formData.id_card" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="车牌号：" prop="tractor_number" v-if="truckType !== 'own'">
            <el-input v-model="formData.tractor_number" placeholder="请输入车牌号"></el-input>
          </el-form-item>
          <div class="department-box" v-if="truckType === 'personal'">
            <el-form-item label="当前所属部门：" prop="department_id" style="width: 100%">
              <el-tag v-if="formData.department_display">{{formData.department_display}}</el-tag>
              <el-button type="primary" @click="dialogDepartment = true">选择部门</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </nf-dialog>
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
/**
 * @Description: 快捷添加运力
 * @Author: wjw
 * @Date: 2020-04-14 10:19:33
 */
export default {
  name: 'nfQuickTruck',
  props: {
    dialogAddTruck: {
      type: Boolean,
      default: false
    },
    // own自有，personal个人，contract合同外协
    truckType: {
      type: String,
      default: 'own'
    }
  },
  data() {
    return {
      dialogDepartment: false,
      defaultDepartment: {id: '', name: ''},
      formData: {
        driver_name: '',
        mobile_phone: '',
        tractor_number: '',
        id_card: '',
        driver_id: '',
        tractor_id: '', //车牌
        trailer_id: '', //挂车
        partner_id: '', //承运方
        department_id: '',
        department_display: ''
      },
      formRules: {
        driver_name: [{ required: true, message: '请输入驾驶员名称', trigger: 'blur'}],
        mobile_phone: [{ required: true, validator: this.$valid.isPhone(), trigger: 'blur'}],
        tractor_number: [{ required: true, validator: this.$valid.isCarNumber(), trigger: 'blur'}],
        id_card: [{ required: true, validator: this.$valid.isIdCard(), trigger: 'blur'}],
        driver_id: [{ required: true, message: '请选择驾驶员', trigger: 'blur'}],
        tractor_id: [{ required: true, message: '请选择车牌号', trigger: 'blur'}],
        trailer_id: [{ required: true, message: '请选择挂车车牌号', trigger: 'blur'}],
        partner_id: [{ required: true, message: '请选择承运方', trigger: 'blur'}],
        department_id: [{ required: true, message: '请选择所属部门', trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 获取选择的部门信息
    getSelectData(val) {
      this.defaultDepartment = val
      this.formData.department_id = val.id
      this.formData.department_display = val.name
    },
    // 确认添加内部里程
    clickSureBtn(loading) {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          let params = {}, url;
          switch(this.truckType) {
            case 'own':
              url = api.truckOwn
              params = {
                tractor_id: this.formData.tractor_id,
                trailer_id: this.formData.trailer_id,
                driver_id: this.formData.driver_id
              }
              break
            case 'personal':
              url = api.truckPersonal
              params = {
                driver_name: this.formData.driver_name,
                mobile_phone: this.formData.mobile_phone,
                id_card: this.formData.id_card,
                tractor_number: this.formData.tractor_number,
                department_id: this.formData.department_id
              }
              break
            case 'contract':
              url = api.truckContract
              params = {
                partner_id: this.formData.partner_id,
                driver_name: this.formData.driver_name,
                mobile_phone: this.formData.mobile_phone,
                tractor_number: this.formData.tractor_number
              }
              break
          }
          loading(false)
          $post(url, params).then(() =>{
            loading(false)
            this.$message.success('添加成功')
            this.dialogClose()
            this.$emit('success')
          }).catch(() => {
            loading(false)
          })
        } else {
          return false
        }
      })
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogAddTruck = false
      this.$emit('update:dialogAddTruck', false)
    }
  },
  watch: {
    dialogAddTruck(val) {
      if (!val) return
      this.formData = {
        driver_name: '',
        mobile_phone: '',
        tractor_number: '',
        id_card: '',
        driver_id: '',
        tractor_id: '', //车牌
        trailer_id: '', //挂车
        partner_id: '', //承运方
        department_id: '',
        department_display: ''
      }
      this.$nextTick(() => {
        this.$refs['formData'].clearValidate()
      })
    }
  }
}
</script>
