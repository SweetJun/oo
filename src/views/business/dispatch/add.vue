<template>
  <div>
    <nf-form-wrap title="基础信息" :on-save-btn-click="onSaveBtnClick">
      <el-form :model="formData" ref="ruleForm" :rules="formRules" inline label-position="top">
        <el-form-item label="选择承运类型：" prop="transport_type">
          <nf-select
            placeholder="请选择承运类型"
            :disabled="isEditing"
            :options="transportTypeList"
            :value.sync="formData.transport_type"
            @change="transportTypeChange">
          </nf-select>
        </el-form-item>
        <el-form-item label="选择承运方：" prop="transport_unit" v-if="truck_type === 'contract'">
          <nf-select
            placeholder="请选择承运方"
            search-key="provider_name"
            :options="transportUnitList"
            :value.sync="formData.transport_unit">
          </nf-select>
        </el-form-item>
        <el-form-item label="调度单类型：" prop="dispatch_type" v-if="truck_type === 'own'">
          <nf-select
            placeholder="请选择调度单类型"
            :options="dispatchTypeList"
            :clearable="false"
            :value.sync="formData.dispatch_type">
          </nf-select>
        </el-form-item>
        <el-form-item label=" " v-if="!isEditing">
          <el-button type="primary" @click="selectTruck">选择运力</el-button>
        </el-form-item>
      </el-form>
      <ul class="detail" v-if="selectionTruck.id">
        <li class="item">
          <span>驾驶员姓名</span>
          <p>{{selectionTruck.driver_name || '无'}}</p>
        </li>
        <li class="item">
          <span>驾驶员手机号</span>
          <p>{{selectionTruck.mobile_phone || '无'}}</p>
        </li>
        <li class="item">
          <span>车牌号</span>
          <p>{{selectionTruck.tractor_number || '无'}}</p>
        </li>
        <li class="item">
          <span>运力状态</span>
          <p>{{selectionTruck.state_name || '无'}}</p>
        </li>
      </ul>
    </nf-form-wrap>
    <div style="margin-bottom: 20px;" v-if="!isEditing">
      <el-button type="primary" @click="addNewDispatch">新建调令</el-button>
    </div>

    <dispatch-list ref="dispatchList" :dispatch-type="formData.dispatch_type"></dispatch-list>

    <div class="do-bill">
      <el-checkbox v-if="isShowChecked" v-model="checked">去做借支单</el-checkbox>
    </div>
    <!-- 选择运力 -->
    <nf-select-truck
      v-if="dialogTruck"
      :dialog-truck.sync="dialogTruck"
      :multiple="false"
      :truck-type="truck_type"
      :transportUnit="formData.transport_unit"
      :select-data="selectionTruck"
      @select-change="getSelectData">
    </nf-select-truck>
    <!-- 确认费用 -->
    <sure-expense
      :dialog-expense.sync="dialogExpense"
      :expense-data="expenseData"
      :dispatch-data="formData"
      @expense-save="expenseSave">
    </sure-expense>
  </div>
</template>

<script>
import dispatchList from './components/dispatchList'
import sureExpense from './components/sureExpense'
export default {
  components: {
    dispatchList,
    sureExpense
  },
  data() {
    return {
      isEditing: false,
      isShowChecked: true,
      pri: {dispatch_borrowing_add: false},
      privileges: [],
      dialogTruck: false,
      dialogVehicle: false,
      dialogExpense: false,
      checked: true,
      truck_type: 'contract',
      transportUnitList: [],
      expense_calculation_point: '', // 记录是不是制单时候算总价
      selectionTruck: {},
      formData: {
        transport_type: '',
        transport_unit: '',
        dispatch_type: 'heavy',
        truck: ''
      },
      formRules: {
        transport_type: [{required: true, message: '请选择承运方', trigger: 'blur'}],
        transport_unit: [{required: true, message: '请选择承运方', trigger: 'blur'}],
        dispatch_type: [{required: true, message: '请选择调度单类型', trigger: 'blur'}],
        truck: [{required: true, message: '请选择运力型', trigger: 'blur'}]
      },
      dispatchTypeList: [
        {key: 'heavy', value: '重驶'},
        {key: 'empty', value: '空驶'}
      ]
    }
  },
  computed: {
    transportTypeList() {
      return this.$store.state['dispatchModule'].transportTypeList
    }
  },
  methods: {
    // 获取承运类型
    getTransportType() {
      let url = `${api.searchItemOption}/transport_type_name`
      $get(url).then(res => {
        this.$store.commit('dispatchModule/updateTransportTypeList', res ? res : [])
      })
    },
    // 选择承运类型后调用接口，判断该承运类型是否为合同外协
    transportTypeChange(val) {
      if (!val) {
        this.truck_type = 'contract'
        this.formData.transport_unit = ''
        this.formData.dispatch_type = 'heavy'
        return
      }
      $get(`${api.transportType}/${val}`).then(res => {
        this.truck_type = res.truck_type
        if(this.isEditing || !this.pri.dispatch_borrowing_add) {
          this.isShowChecked = false
          this.checked = false
        }else {
          this.isShowChecked = this.truck_type !== 'contract' ? true : false
          this.checked = this.truck_type !== 'contract' ? true : false
        }
        this.expense_calculation_point = res.expense_calculation_point
        if (!this.isEditing) {
          if (res.truck_type === 'contract') {
            this.formData.transport_unit = ''
            this.formData.dispatch_type = 'heavy'
          } else {
            this.formData.transport_unit = 0
            this.formData.dispatch_type = 'heavy'
          }
        }
      })
    },
    // 选择运力
    selectTruck() {
      if (!this.formData.transport_type) {
        this.$message.warning('请先选择承运类型！')
        return
      }
      this.dialogTruck = true
    },
    // 获取选择的运力数据
    getSelectData(val) {
      this.selectionTruck = val
      this.truck = val.id
    },
    // 添加调令
    addNewDispatch() {
      this.$refs['dispatchList'].addDispatch(this.formData.dispatch_type)
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (!this.selectionTruck.id) {
            this.$message.error('请选择运力')
            return
          }
          this.formData.truck = this.selectionTruck.id
          if (this.expense_calculation_point === 'dispatch_created' && !this.isEditing) {
            let dispatchList = this.$refs['dispatchList'].dispatchList
            this.expenseData = dispatchList.map(item => {
              return {
                from: item.from,
                from_display: item.from_display,
                to: item.to,
                to_display: item.to_display,
                carry_type: item.carry_type,
                vehicles_number: item.vehicles.length,
                rule_id: '',
                ruleList: [],
                total_price: '',
                vehicles: item.vehicles
              }
            })
            this.dialogExpense = true
            this.loadingFun = loading
          } else {
            this.saveDispatch(loading)
          }
        } else {
          return false;
        }
      })
    },
    // 保存费用回调
    expenseSave(data) {
      this.preset_settlement_detail = data.commands.map(item => {
        return {
          rule_id: item.rule_id,
          amount: this.moneyYuanToCent(item.total_price)
        }
      })
      this.saveDispatch(this.loadingFun, data.money)
    },
    // 保存调度单
    saveDispatch(loading, totalMoney) {
      if (this.expense_calculation_point === 'dispatch_created') {
        this.formData.preset_settlement_amount = this.moneyYuanToCent(totalMoney)
        this.formData.preset_settlement_detail = this.preset_settlement_detail
      }
      if (this.formData.dispatch_type === 'empty') {
        this.formData.cost_incorporate = this.$refs['dispatchList'].cost_incorporate
      }
      let dispatchList = this.$refs['dispatchList'].dispatchList
      let commands = []
      for (let i = 0; i < dispatchList.length; i++) {
        let item = dispatchList[i]
        if (Number(item.mileage) <= 0) {
          this.$message.warning(`出发地“${item.from_display}”到目的地“${item.to_display}”没有相应内部里程`)
          return
        }
        let obj = {
          from: item.from,
          to: item.to,
          carry_type: item.carry_type,
          vehicles: item.vehicles.map(vehicle => {
            return {
              order_vehicle: Number(vehicle.id.split('_')[0]), // 商品车id
              transfer: vehicle.transfer // 是否中转
            }
          })
        }
        if (this.isEditing) {
          obj.id = item.id
        }
        commands.push(obj)
      }
      if(commands.length === 0) {
        this.$message.error('请添加调令')
        return
      }
      let postParams = {
        dispatch: this.formData,
        commands: commands
      }
      loading(true)
      if (this.isEditing) { // 判断 编辑 和 新增
        let apiUrl = `${api.dispatch}/${this.edit_id}`
        $put(apiUrl, postParams).then(() =>{
          loading(false)
          this.$message.success('编辑成功')
          this.$router.back()
        }).catch(() => {
          loading(false)
        })
      } else {
        $post(api.dispatch, postParams).then(res =>{
          loading(false)
          this.$message.success('添加成功')
          if(this.checked) {
            this.$router.push({
              path: '/borrowing/add',
              query: {
                dispatch_id: res.id
              }
            })
          }else {
            this.$router.back()
          }
        }).catch(() => {
          loading(false)
        })
      }
    },
    // 获取调度单详情
    getDetail() {
      let url = `${api.dispatch}/${this.edit_id}`
      $get(url, {data_parts: JSON.stringify(['dispatch','commands'])}).then(res => {
        const dispatch = res.dispatch
        this.transportTypeChange(dispatch.transport_type)
        const commands = res.commands
        commands.forEach(item => {
          if (item.vehicles) {
            item.vehicles.forEach(vehicle => {
              let display = vehicle.order_vehicle_display
              this.$set(vehicle, 'id', `${vehicle.order_vehicle}_${vehicle.order_vehicle}`)
              this.$set(vehicle, 'from_display', display.from_display)
              this.$set(vehicle, 'to_display', display.to_display)
              this.$set(vehicle, 'vin', display.vin)
              this.$set(vehicle, 'vehicle_display', display.vehicle_display)
            })
          }
        })
        this.$refs['dispatchList'].dispatchList = commands
        this.formData = {
          transport_type: dispatch.transport_type,
          transport_unit: dispatch.transport_unit,
          dispatch_type: dispatch.dispatch_type,
          truck: dispatch.truck
        }
        this.transportUnitList = [{key: dispatch.transport_unit, value: dispatch.transport_unit_display}]
        this.selectionTruck = {
          id: dispatch.truck,
          driver_name: dispatch.truck_driver_name,
          mobile_phone: dispatch.truck_driver_mobile,
          tractor_number: dispatch.truck_tractor_number,
          state_name: dispatch.truck_state
        }
      })
    }
  },
  async created() {
    // 去做借支单是否显示
    let privileges = [
      'dispatch_borrowing_add'
    ]
    this.pri = await this.checkPrivileges(privileges)
    if(!this.pri.dispatch_borrowing_add) {
      this.isShowChecked = false
      this.checked = false
    }
    this.getTransportType()
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      this.getDetail(this.edit_id)
      this.isShowChecked = false
      this.checked = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail{
    padding: 0;
    list-style: none;
    margin: 0;
    li.item{
      display: inline-block;
      padding: 0 50px;
      box-sizing: border-box;
      position: relative;
      &:first-child{
        padding-left: 0;
      }
      &:last-child{
        padding-right: 0px;
      }
      &:not(:last-child):after{
        content: '';
        position: absolute;
        width: 1px;
        height: 27px;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: $themeColor;
      }
      p{
        font-size: 20px;
        font-weight: 400;
        margin-top: 15px;
        margin-bottom: 0;
      }
    }
  }
  .nf-form-wrap.show-footer{
    margin-bottom: 20px;
  }
  .do-bill{
    margin-bottom: 90px;
  }
  .el-checkbox /deep/{
    .el-checkbox__label{
      font-size: 16px;
    }
  }
</style>
