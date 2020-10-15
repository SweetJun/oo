<template>
  <div>
    <nf-form-wrap title="承运类型管理" :on-save-btn-click="onSaveBtnClick">
      <el-form
        :model="formData"
        ref="ruleForm"
        inline
        :rules="formRules"
        label-position="top">
        <el-form-item label="承运类型名称：" prop="name">
          <el-input v-model="formData.name" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="调度单编码前缀：" prop="number_prefix">
          <el-input v-model="formData.number_prefix" maxlength="10" clearable placeholder="请输入调度单编号的前缀"></el-input>
        </el-form-item>
        <div v-show="isShow">
          <ul class="transport-type">
            <li class="type-item">
              <div class="item-container">
                <div class="item-name">承运方</div>
                <div class="item-content">
                  <el-radio-group
                    v-model="formData.truck_type"
                    :disabled="isEditing"
                    @change="truckTypeChange">
                    <el-radio label="own">自有车</el-radio>
                    <el-radio label="contract">合同外协</el-radio>
                    <el-radio label="personal">个人外协</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </li>
          </ul>
          <div class="transport-box">
            <h4>业务流程相关</h4>
            <ul class="transport-type">
              <li class="type-item">
                <div class="item-container">
                  <div class="item-name">是否需要操作装车</div>
                  <div class="item-content">
                    <el-radio-group v-model="formData.dispatch_load_vehicle">
                      <el-radio :label="true">需要</el-radio>
                      <el-radio :label="false">不需要</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </li>
              <li class="type-item">
                <div class="item-container">
                  <div class="item-name">是否需要操作交车</div>
                  <div class="item-content">
                    <el-radio-group v-model="formData.dispatch_delivery_vehicle">
                      <el-radio :label="true">需要</el-radio>
                      <el-radio :label="false">不需要</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="transport-box">
            <h4>财务/结算相关</h4>
            <ul class="transport-type">
              <li class="type-item" v-if="formData.truck_type !== 'contract'">
                <div class="item-container">
                  <div class="item-name">是否给借支</div>
                  <div class="item-content">
                    <el-radio-group v-model="formData.prepayment">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </li>
              <li class="type-item" v-if="formData.truck_type !== 'contract'">
                <div class="item-container">
                  <div class="item-name">是否可以补款</div>
                  <div class="item-content">
                    <el-radio-group v-model="formData.midway_supplement">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </li>
              <li class="type-item">
                <div class="item-container">
                  <div class="item-name">进入结算的节点</div>
                  <div class="item-content">
                    <el-radio-group v-model="formData.settlement_start_point">
                      <el-radio label="truck_assigned">派车以后</el-radio>
                      <el-radio label="dispatch_completed">调度单完成</el-radio>
                      <el-radio label="vehicle_delivered">调度单完成且可交车的商品车已交车</el-radio>
                      <el-radio label="order_replied" >调度单完成且可回单的商品车已回单</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </li>
              <li class="type-item" v-if="formData.truck_type !== 'contract'">
                <div class="item-container">
                  <div class="item-name">总费用计算节点</div>
                  <div class="item-content">
                    <el-radio-group v-model="formData.expense_calculation_point" :disabled="!can_switch_expense_calculation_point">
                      <el-radio label="dispatch_created">制作调度单时候</el-radio>
                      <el-radio label="dispatch_settled" >结算时候</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </li>
              <li class="type-item">
                <div class="item-container">
                  <div class="item-name">结算负责人</div>
                  <div class="item-content">
                    <el-tag
                      v-for="(item, index) in selectMembers"
                      :key="index"
                      closable
                      @close="handleClose(index)">
                      {{item.name}}
                    </el-tag>
                    <el-button type="text" @click="editPeople" style="padding: 0;">选择员工</el-button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="transport-box">
            <h4>其他</h4>
            <ul class="transport-type">
              <li class="type-item">
                <div class="item-container">
                  <div class="item-name">计费引擎金额取值设置</div>
                  <div class="item-content">
                    <el-radio-group v-model="formData.expense_amount_selection">
                      <el-radio label="max_amount">取金额最大的</el-radio>
                      <el-radio label="min_amount">取金额最小的</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-form>
    </nf-form-wrap>
    <!-- 添加成员 -->
    <nf-dialog-member
      v-if="dialogMember"
      :dialog-member.sync="dialogMember"
      :select-members="selectMembers"
      @handle-click-sure="handleClickSure">
    </nf-dialog-member>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditing: false,
      dialogMember: false,
      isShow: true, // 防止默认值闪烁
      can_switch_expense_calculation_point: true,
      selectMembers: [],
      formData: {
        name: '', // 承运类型名称
        number_prefix: '', // 调度单编号前缀
        truck_type: 'own', // 承运方
        dispatch_load_vehicle: true, // 是否需要操作装车
        dispatch_delivery_vehicle: true, // 是否需要操作交车
        prepayment: true, // 是否给借支
        midway_supplement: true, // 是否可以补款
        settlement_user: [], // 结算条件
        settlement_start_point: 'order_replied', // 进入结算的节点
        expense_calculation_point: 'dispatch_created', // 总费用计算节点
        expense_amount_selection: 'max_amount' // 计费引擎金额取值设置
      },
      formRules: {
        name: [{ required: true, message: '请输入承运类型名称', trigger: 'blur' }],
        number_prefix: [{ required: true, message: '请输入调度单编号前缀', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击选择员工
    editPeople() {
      this.dialogMember = true
    },
    // 确认选择成员
    handleClickSure(val) {
      this.selectMembers = val
    },
    // 删除员工
    handleClose(index) {
      this.selectMembers.splice(index, 1)
    },
    // 承运方
    truckTypeChange() {
      if (this.formData.truck_type === 'personal') {
        // this.formData.settlement_condition = ['oil_card_returned']
      } else {
        if (this.formData.truck_type === 'contract') {
          this.formData.expense_calculation_point = ''
        } else {
          this.formData.expense_calculation_point = 'dispatch_created'
        }
      }
    },
    // 是否需要操作回单
    orderReplyChange() {
      if (this.formData.settlement_start_point === 'order_replied') {
        if (this.formData.order_reply) {
          this.formData.settlement_start_point = 'order_replied'
        } else {
          this.formData.settlement_start_point = 'truck_assigned'
          this.formData.expense_calculation_point = 'dispatch_created'
        }
      }
    },
    // 编辑时获取详情信息
    getDetail(id) {
      this.isShow = false
      $get(`${api.transportType}/${id}`).then(res => {
        this.selectMembers = res.settlement_user_display.map(item => {
          return {
            id: item.key,
            name: item.value
          }
        })
        this.isShow = true
        this.can_switch_expense_calculation_point = res.can_switch_expense_calculation_point
        this.formData = {
          name: res.name, // 承运类型名称
          number_prefix: res.number_prefix, // 调度单编号前缀
          truck_type: res.truck_type, // 承运方
          dispatch_load_vehicle: res.dispatch_load_vehicle, // 是否需要操作装车
          dispatch_delivery_vehicle: res.dispatch_delivery_vehicle, // 是否需要操作交车
          prepayment: res.prepayment, // 是否给借支
          midway_supplement: res.midway_supplement, // 是否可以补款
          settlement_user: res.settlement_user, // 结算条件
          settlement_start_point: res.settlement_start_point, // 进入结算的节点
          expense_calculation_point: res.expense_calculation_point, // 总费用计算节点
          expense_amount_selection: res.expense_amount_selection // 计费引擎金额取值设置
        }
      })
    },
    // 保存提交
    onSaveBtnClick(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          this.formData.settlement_user = this.selectMembers.map(item => item.id)
          if (this.isEditing) { // 判断 编辑 和 新增
            let apiUrl = `${api.transportType}/${this.edit_id}`
            $put(apiUrl, this.formData).then(() => {
              loading(false)
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.transportType, this.formData).then(() => {
              loading(false)
              this.$message.success('添加成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          }
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .transport-type{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .type-item{
    width: 100%;
    padding: 10px 0px;
    border-bottom: 1px solid #EBEEF5;
    .item-container{
      display: flex;
      border-left: 3px solid #409EFF;
      padding: 5px 5px 5px 12px;
      align-items: center;
    }
    .item-name{
      width: 200px;
    }
  }
  .item-content{
    margin-left: 20px;
    .el-button.el-button--text{
      text-decoration: underline;
    }
    .el-tag{
      margin-right: 20px;
      margin-bottom: 15px;
    }
  }
</style>
