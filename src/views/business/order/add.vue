<template>
  <div>
    <nf-form-wrap title="添加运单" :on-save-btn-click="onSaveBtnClick">
      <el-form class="box_260" :model="ruleForm" ref="ruleForm" :rules="rules" label-position="top">
        <div class="clearfix">
          <el-form-item label="客户名称" prop="client">
            <nf-auto-select :placeholder="'客户名称'" :optionsKey="'client_name'" :propOptions.sync="client_list"
              :propObj.sync="ruleForm.client_obj" :propKey.sync="ruleForm.client"
              :propValue.sync="ruleForm.client_display"></nf-auto-select>
          </el-form-item>
          <el-button class="add-quickly-btn" type="primary" icon="el-icon-plus" @click="addQuickly"></el-button>
        </div>
        <div class="clearfix hasCheckbox">
          <el-form-item label="运单起运地" prop="from">
            <nf-auto-select :placeholder="'运单起运地'" :optionsKey="'region_no_province_from'" :propOptions.sync="from_list"
              :propObj.sync="ruleForm.from_obj" :propKey.sync="ruleForm.from" :propValue.sync="ruleForm.from_display">
            </nf-auto-select>
          </el-form-item>
          <el-form-item label="运单目的地" prop="to">
            <nf-auto-select :placeholder="'运单目的地'" :optionsKey="'region_no_province_to'" :propOptions.sync="to_list"
              :propObj.sync="ruleForm.to_obj" :propKey.sync="ruleForm.to" :propValue.sync="ruleForm.to_display">
            </nf-auto-select>
          </el-form-item>
          <el-form-item label="所属办事处" prop="agency">
            <el-select v-model="ruleForm.agency" clearable filterable>
              <el-option v-for="(item,index) in agency_list" :key="index" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <p class="custom">
          <el-checkbox v-model="ruleForm.isCustom" @change="changeCustom">自定义结算地</el-checkbox>
          <span class="sp1"
            v-if="ruleForm.isCustom">结算地信息：{{ruleForm2.settlement_from_display || '?'}}<i> 至 </i>{{ruleForm2.settlement_to_display || '?'}}</span>
          <span class="sp2" v-if="ruleForm.isCustom" @click="changeSr">修改</span>
        </p>
        <div class="clearfix">
          <el-form-item label="运单类型" prop="order_type">
            <el-select v-model="ruleForm.order_type" clearable filterable>
              <el-option v-for="(item,index) in order_type_list" :key="index" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品车类型" prop="vehicle_type">
            <el-select v-model="ruleForm.vehicle_type" clearable filterable>
              <el-option v-for="(item,index) in vehicle_type_list" :key="index" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="运单号" prop="number">
            <el-input v-model="ruleForm.number" clearable placeholder="请输入运单号">
            </el-input>
          </el-form-item>
          <el-form-item label="下单时间" prop="place_time">
            <el-date-picker v-model="ruleForm.place_time" type="datetime" placeholder="选择下单时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="要求运到时间" prop="required_arrival_time">
            <el-date-picker v-model="ruleForm.required_arrival_time" type="datetime" placeholder="选择要求运到时间">
            </el-date-picker>
          </el-form-item>
        </div>
        <!-- 添加商品车 -->
        <addCar ref="addCar" :tableData="tableData" :vehicle_brand_level_two_list="vehicle_brand_level_two_list">
        </addCar>
      </el-form>
      <nf-dialog :title="title" :dialog-visible.sync="dialogVisible" :click-sure-btn="clickSureBtn" :width="'580px'">
        <div class="content clearfix" slot="content">
          <el-form class="box_260" :model="ruleForm1" ref="ruleForm1" :rules="rules1" label-position="top">
            <el-form-item label="结算起运地" prop="settlement_from">
              <nf-auto-select :placeholder="'结算起运地'" :optionsKey="'region_from'"
                :propOptions.sync="ruleForm1.settlement_from_list" :propObj.sync="ruleForm1.settlement_from_obj"
                :propKey.sync="ruleForm1.settlement_from" :propValue.sync="ruleForm1.settlement_from_display">
              </nf-auto-select>
            </el-form-item>
            <el-form-item style="margin-right:0;" label="结算目的地" prop="settlement_to">
              <nf-auto-select :placeholder="'结算目的地'" :optionsKey="'region_to'"
                :propOptions.sync="ruleForm1.settlement_to_list" :propObj.sync="ruleForm1.settlement_to_obj"
                :propKey.sync="ruleForm1.settlement_to" :propValue.sync="ruleForm1.settlement_to_display">
              </nf-auto-select>
            </el-form-item>
          </el-form>
        </div>
      </nf-dialog>
      <nf-dialog :title="'添加客户'" :dialog-visible.sync="dialogVisible1" :close-dialog="closeDialog"
        :click-sure-btn="clickSureBtn1" :width="'1000px'">
        <div class="content clearfix" slot="content">
          <nf-quick-client ref="client" :dialogVisible1.sync="dialogVisible1" :clientName.sync="clientName" :clientId.sync="clientId">
          </nf-quick-client>
        </div>
      </nf-dialog>
    </nf-form-wrap>
  </div>
</template>

<script>
import addCar from './components/addCar'
export default {
  data() {
    return {
      isAddQuickly: true,
      clientName: '',
      clientId: '',
      options_f: [],
      edit_id: '',
      isEditing: false,
      dialogVisible: false, // 自定义结算地址
      dialogVisible1: false,
      ruleForm: {
        "client_obj": {}, // 客户
        "client": '', // 客户id
        "client_display": '', //客户名称
        "agency": '', // 办事处id
        "from_obj": {},
        "from": '', // 起运地地区id
        "from_display": '',
        "to_obj": {},
        "to": '', // 目的地地区id
        "to_display": '',
        "isCustom": false, // 自定义结算地址
        "number": '', // 运单号
        "settlement_from_obj": {},
        "settlement_from": '', // 自定义结算起运地id
        "settlement_from_display": '',
        "settlement_to_obj": {},
        "settlement_to": '', // 自定义结算目的地id
        "settlement_to_display": '',
        "order_type": '', // 运单类型id
        "vehicle_type": '', // 商品车类型id
        "place_time": '', // 下单时间
        "required_arrival_time": '' // 要求运到时间
      },
      ruleForm1: {
        "settlement_from_obj": {},
        "settlement_from": '', // 自定义结算起运地id
        "settlement_from_display": '',
        "settlement_from_list": [], // 展示用
        "settlement_to_obj": {},
        "settlement_to": '', // 自定义结算目的地id
        "settlement_to_display": '',
        "settlement_to_list": [] // 展示用
      },
      ruleForm2: {
        "settlement_from_obj": {},
        "settlement_from": '', // 自定义结算起运地id
        "settlement_from_display": '',
        "settlement_from_list": [], // 展示用
        "settlement_to_obj": {},
        "settlement_to": '', // 自定义结算目的地id
        "settlement_to_display": '',
        "settlement_to_list": [] // 展示用
      },
      vehicle_brand_level_two_list: [],
      vehicle_type_list: [],
      order_type_list: [],
      tableData: [],
      client_list: [],
      from_list: [],
      to_list: [],
      rules: {
        client: [{
          required: true,
          message: '请选择客户',
          trigger: 'change'
        }],
        from: [{
          required: true,
          message: '请选择运单起运地',
          trigger: 'change'
        }],
        to: [{
          required: true,
          message: '请选择运单目的地',
          trigger: 'change'
        }],
        agency: [{
          required: true,
          message: '请选择办事处',
          trigger: 'change'
        }]
      },
      rules1: {
        settlement_from: [{
          required: true,
          message: '请选择结算起运地',
          trigger: 'change'
        }],
        settlement_to: [{
          required: true,
          message: '请选择结算目的地',
          trigger: 'change'
        }]
      }
    }
  },
  components: {
    addCar
  },
  created() {
    // 下单时间默认当前时间
    this.ruleForm.place_time = moment().format("YYYY-MM-DD HH:mm:ss")
    this.$store.dispatch('orderModule/getAgency');
    this.getOrderType()
    this.getVehicleType()
    this.getBrand()
    this.edit_id = this.$route.query.id;
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  },
  computed: {
    agency_list() {
      return this.$store.state['orderModule'].agency_list
    }
  },
  watch: {
    'clientId': function (val) {
      if (val) {
        this.ruleForm.client_obj = {
          key: val,
          value: this.clientName
        }
        this.ruleForm.client_display = this.clientName
        this.ruleForm.client = this.clientId
        this.client_list = [this.ruleForm.client_obj]
      }
    }
  },
  methods: {
    // 快速添加客户
    addQuickly() {
      this.dialogVisible1 = true;
    },
    // 获取详情
    getDetail(id) {
      let data_parts = ['order', 'vehicles']
      $get(`${api.order}/${id}`, {
        data_parts: JSON.stringify(data_parts)
      }).then(res => {
        this.ruleForm = res.order;
        this.tableData = res.vehicles;
        this.tableData.forEach(item => {
          if(item.direct_price) {
            item.direct_price = item.direct_price / 100
          }
        })
        this.ruleForm.place_time = this.ruleForm.place_time_display;
        this.ruleForm.required_arrival_time = this.ruleForm.required_arrival_time_display;
        this.ruleForm.order_type = this.ruleForm.order_type === 0 ? '' : this.ruleForm.order_type
        this.ruleForm.vehicle_type = this.ruleForm.vehicle_type === 0 ? '' : this.ruleForm.vehicle_type

        this.ruleForm.client_obj = {
          key: this.ruleForm.client,
          value: this.ruleForm.client_display
        }
        this.client_list = [{
          key: this.ruleForm.client,
          value: this.ruleForm.client_display
        }]
        this.ruleForm.from_obj = {
          key: this.ruleForm.from,
          value: this.ruleForm.from_display
        }
        this.from_list = [{
          key: this.ruleForm.from,
          value: this.ruleForm.from_display
        }]
        this.ruleForm.to_obj = {
          key: this.ruleForm.to,
          value: this.ruleForm.to_display
        }
        this.to_list = [{
          key: this.ruleForm.to,
          value: this.ruleForm.to_display
        }]
        // ruleForm2 用来显示结算地， ruleform1用来做结算地弹框
        this.ruleForm2 = {
          "settlement_from_obj": this.ruleForm.settlement_from ? {
            key: this.ruleForm.settlement_from,
            value: this.ruleForm.settlement_from_display
          } : {},
          "settlement_from": this.ruleForm.settlement_from, // 自定义结算起运地id
          "settlement_from_display": this.ruleForm.settlement_from_display,
          "settlement_from_list": this.ruleForm.settlement_from ? [{
            key: this.ruleForm.settlement_from,
            value: this.ruleForm.settlement_from_display
          }] : [], // 展示用
          "settlement_to_obj": this.ruleForm.settlement_to ? {
            key: this.ruleForm.settlement_to,
            value: this.ruleForm.settlement_to_display
          } : {},
          "settlement_to": this.ruleForm.settlement_to, // 自定义结算起运地id
          "settlement_to_display": this.ruleForm.settlement_to_display,
          "settlement_to_list": this.ruleForm.settlement_to ? [{
            key: this.ruleForm.settlement_to,
            value: this.ruleForm.settlement_to_display
          }] : [] // 展示用
        }
        let isCustom = this.ruleForm.settlement_from ? true : false
        this.$set(this.ruleForm, 'isCustom', isCustom)
      })
    },
    // 保存
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.$refs.addCar.tableData.length === 0) {
            this.$message.closeAll()
            this.$message.warning('请添加商品车')
            return
          }
          let vehicles = []
          this.$refs.addCar.tableData.forEach(item => {
            vehicles.push({
              "id": item.id,
              "brand": item.brand, // 品牌id
              "vehicle": item.vehicle, // 车型id
              "vin": item.vin, // 商品车 vin
              "dealer": item.dealer, // 经销商id
              "fetch_warehouse": item.fetch_warehouse, // 提车库区id
              "load_warehouse": item.load_warehouse, // 装车库区id
              "settlement_count": item.settlement_count || 1, // 结算台数
              "direct_price": item.direct_price * 100 // 特殊发运的价格，以分为单位，如果不是特殊发运，就不用传该字段
            })
          })
          vehicles.forEach((item) => {
            if (item.direct_price === 0 || item.direct_price === '' || item.direct_price === 'undefined') {
              delete(item.direct_price)
            }
          })
          let order = {
            "client": this.ruleForm.client, // 客户id
            "agency": this.ruleForm.agency, // 办事处id
            "from": this.ruleForm.from, // 起运地地区id
            "to": this.ruleForm.to, // 目的地地区id
            "number": this.ruleForm.number, // 运单号
            "settlement_from": this.ruleForm.isCustom ? this.ruleForm.settlement_from : '', // 自定义结算起运地id
            "settlement_to": this.ruleForm.isCustom ? this.ruleForm.settlement_to : '', // 自定义结算目的地id
            "order_type": this.ruleForm.order_type, // 运单类型id
            "vehicle_type": this.ruleForm.vehicle_type, // 商品车类型id
            "place_time": this.ruleForm.place_time, // 下单时间
            "required_arrival_time": this.ruleForm.required_arrival_time // 要求运到时间
          }
          loading(true)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.order}/${this.edit_id}`
            $put(apiUrl, {
              order: order,
              vehicles: vehicles
            }).then(() => {
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.order, {
              order: order,
              vehicles: vehicles
            }).then(() => {
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
    getOrderType() {
      let url = `${api.searchItemOption}/order_type`
      $get(url).then(res => {
        this.order_type_list = res
      })
    },
    getVehicleType() {
      let url = `${api.searchItemOption}/vehicle_type`
      $get(url).then(res => {
        this.vehicle_type_list = res
      })
    },
    getBrand() {
      let url = `${api.searchItemOption}/vehicle_brand_level_two`
      $get(url).then(res => {
        this.vehicle_brand_level_two_list = res
      })
    },
    // 结算地
    changeSr() {
      this.ruleForm1 = _.cloneDeep(this.ruleForm2)
      this.dialogVisible = true
    },
    // 修改自定义结算目的地复选框
    changeCustom() {
      if(this.ruleForm.isCustom) {
        this.ruleForm2 = {
          "settlement_from_obj": this.ruleForm.from_obj,
          "settlement_from": this.ruleForm.from, // 自定义结算起运地id
          "settlement_from_display": this.ruleForm.from_display,
          "settlement_from_list": [this.ruleForm.from_obj], // 展示用
          "settlement_to_obj": this.ruleForm.to_obj,
          "settlement_to": this.ruleForm.to, // 自定义结算目的地id
          "settlement_to_display": this.ruleForm.to_display,
          "settlement_to_list": [this.ruleForm.to_obj] // 展示用
        }
        this.ruleForm1 = {
          "settlement_from": this.ruleForm.from, // 自定义结算起运地id
          "settlement_from_obj": this.ruleForm.from_obj,
          "settlement_from_display": this.ruleForm.from_display,
          "settlement_from_list": [this.ruleForm.from_obj], // 展示用
          "settlement_to_obj": this.ruleForm.to_obj,
          "settlement_to": this.ruleForm.to, // 自定义结算目的地id
          "settlement_to_display": this.ruleForm.to_display,
          "settlement_to_list": [this.ruleForm.to_obj] // 展示用
        }
        this.ruleForm.settlement_from = this.ruleForm2.settlement_from
        this.ruleForm.settlement_to = this.ruleForm2.settlement_to
      }
    },
    // 自定义结算地址弹框确定
    clickSureBtn() {
      this.$refs['ruleForm1'].validate((valid) => {
        if (valid) {
          this.ruleForm2 = JSON.parse(JSON.stringify(this.ruleForm1))
          this.ruleForm.settlement_from = this.ruleForm2.settlement_from
          this.ruleForm.settlement_to = this.ruleForm2.settlement_to
          this.dialogVisible = false
        } else {
          return false;
        }
      });
    },
    // 快速添加客户
    clickSureBtn1() {
      this.$refs.client.onSaveBtnClick()
    },
    // 关闭弹框
    closeDialog() {
      this.$refs.client.resetForm()
      this.dialogVisible1 = false
    }
  }
}

</script>

<style lang="scss" scoped>
  p {
    margin: 0;
    padding: 0;
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

    .hasCheckbox .el-form-item {
      margin-bottom: 18px;
    }

    .custom {
      .sp1 {
        margin-left: 20px;
      }

      .sp2 {
        color: #409EFF;
        margin-left: 10px;
        cursor: pointer;
      }
    }

    .el-checkbox {
      margin-bottom: 20px;
    }

    .el-form-item {
      float: left;
      width: 260px;
      margin-right: 20px;
    }

  }

  .add-quickly-btn {
    margin-top: 27px;
    padding: 9px;
  }

</style>
