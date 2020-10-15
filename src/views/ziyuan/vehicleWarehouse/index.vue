<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selectable="selectableFun"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
      <div class="table-top-left" slot="top-btn-left" v-if="roles['vehicle_warehouse_add']">
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddCode">
          添加
        </el-button>
      </div>
    </nf-table-page>
    <nf-dialog
      :title="title"
      :dialog-visible.sync="dialogVisible"
      :click-sure-btn="clickSureBtn"
      width="850px">
      <div class="content" slot="content">
        <el-form class="box_260" :model="formData" ref="ruleForm" :rules="rules" label-position="top" inline>
          <el-form-item label="名称：" prop="name">
            <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="装车联系人：" prop="contact_name">
            <el-input v-model="formData.contact_name" placeholder="请输入装车联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话：" prop="phone_no">
            <el-input v-model="formData.phone_no" placeholder="请输入联系人电话"></el-input>
          </el-form-item>
          <p style="margin:0 0 15px 0;padding:0;"><span style="color:red;">* </span>装车地址：</p>
          <el-form-item label="" prop="province_id">
            <nf-select
              placeholder="请选择省份"
              :options="provinceList"
              :value.sync="formData.province_id"
              @change="selectProvince">
            </nf-select>
          </el-form-item>
          <el-form-item label="" prop="city_id">
            <nf-select
              placeholder="请选择市"
              :options="cityList"
              :value.sync="formData.city_id"
              @change="selectCity">
            </nf-select>
          </el-form-item>
          <el-form-item label="" prop="district_id">
            <nf-select
              placeholder="请选择区"
              :options="districtList"
              :value.sync="formData.district_id"
              @change="selectArea">
            </nf-select>
          </el-form-item>
          <el-form-item style="width:800px;" label="详细地址：" prop="address">
            <el-input type="textarea" v-model="formData.address" placeholder="请输入详细地址"></el-input>
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
      storeModelName: 'vehicleWarehouseModule',
      isEditing: false,
      edit_id: '',
      title: '添加仓库',
      dialogVisible: false,
      provinceList: [],
      cityList: [],
      districtList: [],
      formData: {
        name: '',
        contact_name: '',
        phone_no: '',
        province_id: '',
        city_id: '',
        district_id: '',
        address: ''
      },
      rules: {
        'name': [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        'province_id': [{
          required: true,
          message: '请选择省',
          trigger: 'blur'
        }],
        'city_id': [{
          required: true,
          message: '请选择市',
          trigger: 'blur'
        }],
        'district_id': [{
          required: true,
          message: '请选择区',
          trigger: 'blur'
        }],
        'address': [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        }]
      },
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: "编辑",
              type: "primary",
              isShow: scope.row.acl.can_edit,
              click: ({row}) => {
                this.editFun(row);
              }
            }
          },
          scope => {
            return {
              name: "删除",
              type: "danger",
              isShow: scope.row.acl.can_delete,
              click: ({row}) => {
                let apiUrl = `${api.vehicleWarehouse}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row, true)
              }
            }
          }
        ]
      },
      batchOptions: [{
        id: 0,
        role: 'vehicle_warehouse_delete',
        label: '批量删除',
        url: api.vehicleWarehouseBatchDelete
      }]
    }
  },
  computed: {
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    handleAddCode() {
      this.getProvince();
      this.title = '添加仓库';
      this.dialogVisible = true;
      this.isEditing = false;
      this.formData = {
        name: '',
        contact_name: '',
        phone_no: '',
        province_id: '',
        city_id: '',
        district_id: '',
        address: ''
      };
    },
    editFun(row) {
      this.title = '编辑仓库'
      this.isEditing = true
      // 获取详情，从列表取
      this.edit_id = row.id
      this.formData = row
      this.dialogVisible = true
      this.getProvince()
      this.getCity(row.province_id, {key: row.province_id, value: row.province_display})
      this.getCounty(row.city_id, {key: row.city_id, value: row.city_display})
    },
    // 获取省
    async getProvince() {
      let apiUrl = `${api.searchItemOption}/level_region_province`
      this.provinceList = await $get(apiUrl)
    },
    // 获取市
    async getCity(provinceId, obj) {
      if (!provinceId) return
      if (!obj) {
        obj = _.find(this.provinceList, item => item.key === provinceId)
      }
      let params = {
        level_region_province: obj
      }
      let apiUrl = `${api.searchItemOption}/level_region_city`
      this.cityList = await $get(apiUrl, {condition: params})
    },
    // 获取区县
    async getCounty(cityId, obj) {
      if (!cityId) return
      if (!obj) {
        obj = _.find(this.cityList, item => item.key === cityId)
      }
      let params = {
        level_region_city: obj
      }
      let apiUrl = `${api.searchItemOption}/level_region_county`
      this.districtList = await $get(apiUrl, {condition: params})
    },
    // 选择省
    selectProvince() {
      this.cityList = [];
      this.districtList = [];
      this.getCity(this.formData.province_id)
      this.formData.parent_id = this.formData.province_id
      this.$set(this.formData, 'city_id', '')
      this.$set(this.formData, 'district_id', '')
    },
    // 选择市
    selectCity(val) {
      this.districtList = [];
      this.getCounty(this.formData.city_id)
      this.formData.parent_id = this.formData.city_id
      this.formData.city_name = _.find(this.cityList, item => item.key === val).value
      this.$set(this.formData, 'district_id', '')
    },
    // 选择区
    selectArea(val) {
      this.formData.parent_id = this.formData.district_id
      this.formData.district_name = _.find(this.districtList, item => item.key === val).value
    },
    clickSureBtn(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true);
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.vehicleWarehouse}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() => {
              this.$message.success('编辑成功');
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
              this.dialogVisible = false;
              loading(false);
            }).catch(() => {
              loading(false);
            })
          } else {
            $post(api.vehicleWarehouse, this.formData).then(() => {
              this.$message.success('添加成功');
              this.$store.dispatch('pageData/getTableData', this.storeModelName)
              this.dialogVisible = false;
              loading(false);
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
