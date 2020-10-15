<template>
  <div>
    <nf-form-wrap title="自有运力管理" :on-save-btn-click="onSaveBtnClick">
      <el-form
        :model="formData"
        ref="ruleForm"
        :rules="formRules"
        label-position="top"
        inline>
        <div class="form-item-box">
          <el-form-item label="车牌号：" prop="tractor_id">
            <el-select
              filterable
              clearable
              v-model="formData.tractor_id"
              remote
              :remote-method="remoteTractorList"
              :loading="loading"
              placeholder="请选择车牌号">
              <el-option
                v-for="(item, index) in tractorList"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
            <el-checkbox v-model="formData.is_tractor">牵引车</el-checkbox>
          </el-form-item>
          <el-button
            v-if="roles['tractor_add']"
            class="add-quickly-btn icon"
            type="primary"
            icon="el-icon-plus"
            @click="addQuickly('car')">
          </el-button>
        </div>
        <div class="form-item-box">
          <el-form-item label="挂车牌号：" prop="trailer_id">
            <el-select
              filterable
              clearable
              v-model="formData.trailer_id"
              remote
              :remote-method="remoteTrailerList"
              :loading="loading"
              placeholder="请选择挂车车牌号">
              <el-option
                v-for="(item, index) in trailerList"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button
            v-if="roles['trailer_add']"
            class="add-quickly-btn icon"
            type="primary"
            icon="el-icon-plus"
            @click="addQuickly('trailer')">
          </el-button>
        </div>
        <div class="form-item-box">
          <el-form-item label="驾驶员：" prop="driver_id">
            <el-select
              filterable
              clearable
              v-model="formData.driver_id"
              remote
              :remote-method="remoteDriverList"
              :loading="loading"
              placeholder="请选择驾驶员">
              <el-option
                v-for="(item, index) in driverList"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button
            v-if="roles['driver_add']"
            class="add-quickly-btn icon"
            type="primary"
            icon="el-icon-plus"
            @click="addQuickly('driver')">
          </el-button>
        </div>
        <div class="form-item-box">
          <el-form-item label="运力分组：" prop="group_id">
            <el-select filterable v-model="formData.group_id" placeholder="请选择运力分组">
              <el-option
                v-for="(item, index) in truckGroupList"
                :key="index"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button
            v-if="roles['truck_group_add']"
            class="add-quickly-btn icon"
            type="primary"
            icon="el-icon-plus"
            @click="addQuickly('truckGroup')">
          </el-button>
        </div>
        <el-form-item label="重驶百公里油耗：" prop="heavy_oil_cost" style="margin-right: 68px;">
          <el-input v-model="formData.heavy_oil_cost" placeholder="重驶百公里油耗">
            <template slot="append">升/百公里</template>
          </el-input>
        </el-form-item>
        <el-form-item label="空驶百公里油耗：" prop="empty_oil_cost">
          <el-input v-model="formData.empty_oil_cost" placeholder="空驶百公里油耗">
            <template slot="append">升/百公里</template>
          </el-input>
        </el-form-item>
      </el-form>
    </nf-form-wrap>
    <nf-dialog
      :title="dialogTitle"
      :dialog-visible.sync="dialogVisible"
      width="400px"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-form :model="dialogData" :rules="dialogRules" ref="dialogForm" label-position="top">
          <el-form-item label="车牌号：" prop="car_number" v-if="dialogType === 'car'">
            <el-input v-model="dialogData.car_number"></el-input>
          </el-form-item>
          <el-form-item label="车牌号：" prop="trailer_number" v-if="dialogType === 'trailer'">
            <el-input v-model="dialogData.trailer_number"></el-input>
          </el-form-item>
          <el-form-item label="运力分组：" prop="truck_group" v-if="dialogType === 'truckGroup'">
            <el-input v-model="dialogData.truck_group"></el-input>
          </el-form-item>
          <div v-if="dialogType === 'driver'">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="dialogData.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="dialogData.mobile"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="id_card">
              <el-input v-model="dialogData.id_card"></el-input>
            </el-form-item>
          </div>
          <div class="department-box">
            <el-form-item label="当前所属部门：" prop="department_id" style="width: 100%">
              <el-tag v-if="dialogData.department_display">{{dialogData.department_display}}</el-tag>
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
export default {
  data() {
    return {
      roles: {},
      privileges: [
        'tractor_add',
        'trailer_add',
        'driver_add',
        'truck_group_add'
      ],
      loading: false,
      dialogVisible: false,
      dialogDepartment: false,
      dialogTitle: '添加车辆',
      dialogType: 'car',
      tractorList: [],
      trailerList: [],
      driverList: [],
      truckGroupList: [],
      defaultDepartment: {id: '', name: ''},
      formData: {
        is_tractor: true,
        tractor_id: '',
        trailer_id: '',
        driver_id: '',
        group_id: '',
        heavy_oil_cost: '',
        empty_oil_cost: ''
      },
      dialogData: {
        car_number: '',
        trailer_number: '',
        department_id: '',
        department_display: '',
        truck_group: '',
        name: '',
        mobile: '',
        id_card: ''
      },
      formRules: {
        tractor_id: [{ required: true, message: '请选择车牌号', trigger: 'change' }],
        trailer_id: [{ required: true, message: '请选择挂车车牌号', trigger: 'change' }],
        driver_id: [{ required: true, message: '请选择驾驶员', trigger: 'change' }]
      },
      dialogRules: {
        car_number: [{ required: true, validator: this.$valid.isCarNumber(), trigger: 'blur' }],
        trailer_number: [{ required: true, validator: this.$valid.isCarNumber('请输入挂车车牌号'), trigger: 'blur' }],
        truck_group: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入驾驶员姓名', trigger: 'blur' }],
        mobile: [{ required: true, validator: this.$valid.isPhone(), trigger: 'blur' }],
        id_card: [{ required: true, validator: this.$valid.isIdCard(), trigger: 'blur' }],
        department_id: [{ required: true, message: '请选择所属部门', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取选择的部门信息
    getSelectData(val) {
      this.defaultDepartment = val
      this.dialogData.department_id = val.id
      this.dialogData.department_display = val.name
    },
    // 获取车牌
    remoteTractorList(query) {
      if (query.trim() !== '') {
        this.loading = true
        let url = `${api.searchItemAutocomplete}/tractor_number`
        $get(url, { keyword: query}).then(res => {
          this.loading = false
          this.tractorList = res
        })
      } else {
        this.tractorList = []
      }
    },
    // 获取挂车车牌
    remoteTrailerList(query) {
      if (query.trim() !== '') {
        this.loading = true
        let url = `${api.searchItemAutocomplete}/trailer_number`
        $get(url, { keyword: query}).then(res => {
          this.loading = false
          this.trailerList = res
        })
      } else {
        this.trailerList = []
      }
    },
    // 获取驾驶员
    remoteDriverList(query) {
      if (query.trim() !== '') {
        this.loading = true
        let url = `${api.searchItemAutocomplete}/driver_own_name_or_mobile`
        $get(url, { keyword: query}).then(res => {
          this.loading = false
          this.driverList = res
        })
      } else {
        this.driverList = []
      }
    },
    // 获取运力分组
    getTruckGroupList() {
      $get(api.truckGroupOptions).then(res => {
        this.truckGroupList = res
      })
    },
    // 快速添加弹框
    addQuickly(type) {
      this.defaultDepartment = {id: '', name: ''}
      this.dialogData.department_id = ''
      this.dialogData.department_display = ''
      this.dialogType = type
      switch(type) {
        case 'car':
          this.dialogTitle = '添加车辆'
          break;
        case 'trailer':
          this.dialogTitle = '添加挂车'
          break
        case 'driver':
          this.dialogTitle = '添加驾驶员'
          break
        case 'truckGroup':
          this.dialogTitle = '添加运力分组'
          break;
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dialogForm'].resetFields()
      })
    },
    // 快速添加确定
    clickSureBtn(loading) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          loading(true)
          let apiUrl = '', params = {};
          switch(this.dialogType) {
            case 'car':
              apiUrl = api.tractor
              params = {
                number: this.dialogData.car_number,
                department_id: this.dialogData.department_id,
                type: 'own'
              }
              break;
            case 'trailer':
              apiUrl = api.trailer
              params = {
                number: this.dialogData.trailer_number,
                department_id: this.dialogData.department_id,
                type: 'own'
              }
              break
            case 'driver':
              apiUrl = api.driver
              params = {
                name: this.dialogData.name,
                type: 'own',
                mobile: this.dialogData.mobile,
                id_card: this.dialogData.id_card,
                department_id: this.dialogData.department_id
              }
              break
            case 'truckGroup':
              apiUrl = api.truckGroup
              params = {
                name: this.dialogData.truck_group
              }
              break;
          }
          $post(apiUrl, params).then((res) =>{
            loading(false)
            this.dialogVisible = false
            this.$message.success('添加成功')
            switch(this.dialogType) {
              case 'car':
                this.tractorList.unshift({
                  key: res.id,
                  value: res.number
                })
                this.formData.tractor_id = res.id
                break;
              case 'trailer':
                this.trailerList.unshift({
                  key: res.id,
                  value: res.number
                })
                this.formData.trailer_id = res.id
                break
              case 'driver':
                this.driverList.unshift({
                  key: res.id,
                  value: `${res.name}(${res.mobile})`
                })
                this.formData.driver_id = res.id
                break
              case 'truckGroup':
                this.truckGroupList.unshift({
                  key: res.id,
                  value: res.name
                })
                this.formData.group_id = res.id
                break;
            }
          }).catch(() => {
            loading(false)
          })
        }
      })
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          $post(api.truckOwn, this.formData).then(() =>{
            loading(false)
            this.$message.success('添加成功')
            this.$router.back()
          }).catch(() => {
            loading(false)
          })
        } else {
          return false;
        }
      })
    },
    // 权限检测
    getPrivileges() {
      this.checkPrivileges(this.privileges).then(res => {
        this.roles = res ? res : {}
      })
    }
  },
  created() {
    this.getPrivileges()
    this.getTruckGroupList()
  }
}
</script>

<style lang="scss" scoped>
  .form-item-box{
    display: inline-block;
  }
</style>
