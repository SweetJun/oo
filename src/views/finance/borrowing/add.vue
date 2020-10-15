<template>
  <div v-loading="pageLoading">
    <nf-form-wrap title="借支单管理" :show-footer="false">
      <el-form :model="formData" ref="baseRuleForm" :rules="formRules" inline label-position="top">
        <div class="dispatch">
          <el-form-item label="选择调度单：" prop="dispatch">
            <!-- <nf-select
              placeholder="请输入调度单选择"
              :disabled="true"
              :options="dispatchOrderList"
              search-key="dispatch_number"
              :value.sync="formData.dispatch"
              @change="getDispatchDetail">
            </nf-select> -->
            <el-input v-model="dispatch_name" disabled></el-input>
          </el-form-item>
        </div>
      </el-form>
      <ul class="detail" v-if="dispatch.id">
        <li class="item">
          <span>承运类型</span>
          <p>{{dispatch.transport_type_display || '无'}}</p>
        </li>
        <li class="item">
          <span>驾驶员姓名</span>
          <p>{{dispatch.truck_driver_name || '无'}}</p>
        </li>
        <li class="item">
          <span>驾驶员手机号</span>
          <p>{{dispatch.truck_driver_mobile || '无'}}</p>
        </li>
        <li class="item">
          <span>车牌号</span>
          <p>{{dispatch.truck_tractor_number || '无'}}</p>
        </li>
      </ul>
    </nf-form-wrap>
    <nf-form-wrap title="调令单据" :show-footer="false">
      <command
        ref="commands"
        v-if="expenseData.commands.length > 0"
        :expense-data="expenseData"
        :store-model-name="storeModelName">
      </command>
    </nf-form-wrap>
    <nf-form-wrap title="支付设置" v-if="finishReckoner"  :on-save-btn-click="onSaveBtnClick">
      <div class="no-settlement-info" v-if="reckonerList.length === 0">
        <p>当前驾驶员没有结算信息，请先关联结算人。</p>
        <el-button type="primary" @click="dialogReckoner = true">关联结算人</el-button>
      </div>
      <div v-else>
        <div
          class="repayment"
          v-if="(repayment > 0 && borrowTotal > 0) || (repayment < 0 && borrowTotal < 0)">
          <p>当前驾驶员“{{dispatch.truck_driver_name}}”存在待抵扣金额"{{repayment}}元"，是否需要抵扣？</p>
          <el-radio-group v-model="isRepayment" @change="repaymentChange">
            <el-radio :label="true">需要</el-radio>
            <el-radio :label="false">不需要</el-radio>
          </el-radio-group>
          <el-form :model="formData" inline label-position="top" v-if="isRepayment">
            <el-form-item
              label="抵扣"
              prop="repayment"
              :rules="[
                {validator: $valid.isFloatNumber(false, '请输入金额'), trigger: 'blur'}
              ]">
              <el-input placeholder="请输入金额" v-model="formData.repayment" style="width: 240px;">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="pay-way-sum">
          <p class="pay-way">
            <span class="name">其他：</span>
            <span class="money">{{defaultTotal | toThousandFilter}}</span> 元
          </p>
          <p class="pay-way">
            <span class="name">银行转账：</span>
            <span class="money">{{bankcardTotal | toThousandFilter}}</span> 元
          </p>
          <p class="pay-way">
            <span class="name">油卡：</span>
            <span class="money">{{oilcardTotal | toThousandFilter}}</span> 元
          </p>
          <p class="pay-way">
            <span class="name">万金油：</span>
            <span class="money">{{wjyTotal | toThousandFilter}}</span> 元
          </p>
          <p class="pay-way">
            <span class="name">借支总费用：</span>
            <span class="money">{{borrowTotal | toThousandFilter}}</span> 元
          </p>
          <p class="pay-way">
            <span class="name">实际支付费用：</span>
            <span class="money">{{borrowTotal - formData.repayment | toThousandFilter}}</span> 元
          </p>
        </div>
        <reckoner
          ref="reckoner"
          v-if="borrowTotal - formData.repayment > 0"
          :dispatch="dispatch"
          :reckoner-list="reckonerList">
        </reckoner>
      </div>
    </nf-form-wrap>
    <!-- 选择结算人 -->
    <nf-select-reckoner
      :dialog-reckoner.sync="dialogReckoner"
      :isEditing="isEditing"
      @select-change="getSelectReckoner">
    </nf-select-reckoner>
  </div>
</template>

<script>
// 新建、编辑借支单
import command from '@/components/nf-views/settlement/command'
import reckoner from '@/components/nf-views/settlement/reckoner'
export default {
  components: {
    command,
    reckoner
  },
  data() {
    return {
      storeModelName: 'borrowingModule',
      pageLoading: false,
      isEditing: false,
      dialogReckoner: false,
      dispatchOrderList: [],
      dispatch: {},
      dispatch_name: '',
      commands: [],
      isRepayment: false, // 是否需要抵扣
      repayment: 0, // 待抵扣金额
      differenceMoney: 0,
      expenseData: {
        commands: [],
        invalid_command_bills: []
      },
      reckonerList: [],
      finishReckoner: false,
      formData: {
        dispatch: '',
        bill_type: 'dispatch_borrowing',
        amount: 0,
        repayment: 0,
        final_amount: 0
      },
      formRules: {
        dispatch: [{required: true, message: '请选择调度单', trigger: 'change'}]
      }
    }
  },
  computed: {
    bankcardTotal() {
      return this.$store.state[this.storeModelName].payMethodTotal.bank_card
    },
    oilcardTotal() {
      return this.$store.state[this.storeModelName].payMethodTotal.oil_card
    },
    wjyTotal() {
      return this.$store.state[this.storeModelName].payMethodTotal.wjy
    },
    defaultTotal() {
      return this.$store.state[this.storeModelName].payMethodTotal.default
    },
    borrowTotal() {
      return this.bankcardTotal + this.oilcardTotal + this.wjyTotal + this.defaultTotal
    }
  },
  methods: {
    // 是否抵扣
    repaymentChange() {
      if (!this.isRepayment) {
        this.formData.repayment = 0
      } else {
        this.formData.repayment = this.rememberRepayment
      }
    },
    // 根据调令获取信息
    getDispatchDetail() {
      if (!this.formData.dispatch) {
        this.dispatch = {}
        this.expenseData = {
          commands: [],
          invalid_command_bills: []
        }
        this.finishReckoner = false
        return
      }
      this.pageLoading = true
      this.getDispatchById()
    },
    // 根据调度单id获取调令
    getDispatchById() {
      let url = `${api.dispatch}/${this.formData.dispatch}`
      $get(url, {data_parts: JSON.stringify(['dispatch','commands'])}).then(res => {
        this.dispatch = res.dispatch
        this.dispatch_name = this.dispatch.number
        this.commands = res.commands
        this.getExpenseRule()
        this.getReckonerInfo()
        this.getRepaymentByTruck()
      })
    },
    // 根据运力获取抵扣金额
    getRepaymentByTruck() {
      let params = {
        time_as_receiver: this.dispatch.create_time
      }
      $get(`${api.owingAmount}/truck/${this.dispatch.truck}`, params).then(res => {
        if (!this.isEditing) {
          this.formData.repayment = 0
          this.rememberRepayment = _.cloneDeep(this.formData.repayment)
        }
        this.repayment = this.moneyCentToYuan(res.amount + this.differenceMoney)
      })
    },
    // 根据运力获取结算人信息
    getReckonerInfo() {
      $get(`${api.truckSettlementAccount}/${this.dispatch.truck}`).then(res => {
        this.finishReckoner = true
        this.reckonerList = res.data
        if (this.isEditing) {
          // 回显结算人数据，在reckonerlist最前面 加获取详情的数据pay_methods
          let settleData = {}
          this.pay_methods.forEach(item => {
            if(item.pay_method === 'bank_card') {
              settleData['bank_cards'] = [item.settlement_pay_method_display]
              settleData['bank_cards'][0]['default'] = true
            }else if(item.pay_method === 'oil_card') {
              settleData['oil_cards'] = [item.settlement_pay_method_display]
              settleData['oil_cards'][0]['default'] = true
            }else {
              settleData['wjy_settlement_accounts'] = [item.settlement_pay_method_display]
              settleData['wjy_settlement_accounts'][0]['default'] = true
            }
          })
          settleData['bank_cards'] = settleData['bank_cards'] ? settleData['bank_cards'] : []
          settleData['oil_cards'] = settleData['oil_cards'] ? settleData['oil_cards'] : []
          settleData['wjy_settlement_accounts'] = settleData['wjy_settlement_accounts'] ? settleData['wjy_settlement_accounts'] : []
          settleData = Object.assign({},settleData,this.pay_methods[0].settlement_account_display)
          this.reckonerList.unshift(settleData)
          setTimeout(() => {
          // 支付设置回显数据
            this.$refs['reckoner'].formData.payTypes = []
            this.pay_methods.forEach(method => {
              let obj = {
                pay_method: method.pay_method,
                label: method.pay_method_display,
                amount: this.moneyCentToYuan(method.amount)
              }
              switch(method.pay_method) {
                case 'bank_card':
                  obj.id = 'bank_id'
                  break
                case 'oil_card':
                  obj.id = 'oil_id'
                  break
                case 'wjy':
                  obj.id = 'wjy_id'
                  break
                case 'default':
                  obj.id = 'default_id'
                  break
              }
              this.$refs['reckoner'].formData.payTypes.push(obj)
            })
          }, 500)
        }
      })
    },
    // 获取计费策略匹配
    getExpenseRule() {
      let params = {
        transport_type: this.dispatch.transport_type,
        dispatch_id: this.dispatch.id,
        scene: 'borrow',
        carry_type: this.dispatch.dispatch_type
      }
      $post(api.expenseRuleMatching, params).then(res => {
        let result = res.data
        // 把所有的金额都由分变为元并计算各支付方式比例
        result.forEach(item => {
          let ruleList = item.ruleList
          ruleList.total_price = this.moneyCentToYuan(ruleList.total_price)
          ruleList.forEach(rule_item => {
            rule_item.total_price = this.moneyCentToYuan(rule_item.total_price)
            rule_item.cost.forEach(_cost => {
              _cost.item_total_price = this.moneyCentToYuan(_cost.item_total_price)
              if (_cost.pay_methods) {
                _.forIn(_cost.pay_methods, (value,key) => {
                  _cost.pay_methods[key] = this.moneyCentToYuan(value)
                  let percent = (value / _cost.item_total_price).toFixed(2)
                  this.$set(_cost, key + '_percent', Number(percent))
                })
              }
            })
          })
        })
        if (!this.isEditing) {
          result.forEach(item => {
            this.commands.forEach(command => {
              if (item.command_id === command.id) {
                this.$set(item, 'from_display', command.from_display)
                this.$set(item, 'to_display', command.to_display)
                this.$set(item, 'mileage', command.mileage)
                this.$set(item, 'carry_type_display', command.carry_type_display)
                if (item.ruleList.length > 0 && !this.isTotalPrice) {
                  this.$set(item, 'selectRule', item.ruleList[0])
                } else {
                  this.$set(item, 'selectRule', {cost: [], total_price: 0})
                }
                return false
              }
            })
          })
          this.expenseData = {
            commands: result,
            invalid_command_bills: []
          }
        } else {
          // 编辑 调令单据 回显
          this.command_bills.forEach(item => {
            result.forEach(command => {
              if (command.command_id === item.id) {
                this.$set(item, 'ruleList', command.ruleList)
                let billItem = item.bill
                if (Array.isArray(billItem) && billItem.length === 0) {
                  this.$set(item, 'selectRule', {cost: [], total_price: 0})
                  return
                }
                this.$set(item, 'selectRule', {
                  id: billItem.rule,
                  total_price: this.moneyCentToYuan(billItem.amount),
                  cost: billItem.expense_items.map(expense => {
                    let methods = {}
                    expense.pay_methods.forEach(pay => {
                      methods[pay.method] = this.moneyCentToYuan(pay.amount)
                    })
                    let _cost = {
                      item_total_price: this.moneyCentToYuan(expense.amount),
                      item_name: expense.expense_item_display,
                      item_id: expense.expense_item,
                      pay_methods: methods
                    }
                    _.forIn(_cost.pay_methods, (value,key) => {
                      let percent = (value / _cost.item_total_price).toFixed(2)
                      this.$set(_cost, key + '_percent', Number(percent))
                    })
                    return _cost
                  })
                })
                return false
              }
            })
          })
          this.expenseData.commands = this.command_bills
        }
        this.$nextTick(() => {
          // 计算总和
          this.$refs['commands'].computeAllPayMoney()
          this.pageLoading = false
        })
      })
    },
    // 确认关联结算人
    getSelectReckoner(val) {
      this.$set(val, 'default', true)
      this.reckonerList = [val]
      $post(api.truckSettlementAccount, {
        truck_id: this.dispatch.truck,
        settlement_account_id: val.id
      }).then(() => {})
      this.$nextTick(() => {
        this.$refs['reckoner'].getSelectReckoner(val)
      })
    },
    // 提交结算
    onSaveBtnClick(loading) {
      this.$message.closeAll()
      // 借支单主体信息
      let shouldPay = this.borrowTotal // 应付金额
      let repayment = this.repayment // 可抵扣金额
      let repaymented = Number(this.formData.repayment) // 所填抵扣的金额
      let bill = {
        dispatch: this.formData.dispatch,
        bill_type: 'dispatch_borrowing',
        amount: this.moneyYuanToCent(shouldPay),
        repayment: this.moneyYuanToCent(repaymented)
      }
      // 如果要操作抵扣，抵扣的金额不能大于/小于应付金额（验证）
      if (shouldPay > 0 && repayment > 0) {
        if (shouldPay - repaymented >= 0 && repaymented <= repayment) {
          bill.final_amount = this.moneyYuanToCent(shouldPay - repaymented)
        } else {
          this.$message.warning('抵扣金额不能大于实付金额，请重新输入!')
          return
        }
      } else if (shouldPay < 0 && repayment < 0) {
        if (shouldPay - repaymented >= 0 && repaymented <= repayment) {
          bill.final_amount = this.moneyYuanToCent(shouldPay - repaymented)
        } else {
          this.$message.warning('抵扣金额不能大于实付金额，请重新输入!')
          return
        }
      } else {
        bill.final_amount = this.moneyYuanToCent(shouldPay)
      }
      if(Number(bill.final_amount) <= 0) {
        this.$message.warning('实际支付费用不能为负')
        return
      }
      // 调令单据信息
      let command_bills = []
      this.expenseData.commands.forEach(command => {
        let commandBill = {}
        if (command.selectRule.cost && command.selectRule.cost.length > 0) {
          commandBill = {
            rule: command.selectRule.id || 0,
            amount: this.moneyYuanToCent(command.selectRule.total_price),
            expense_items: []
          }
          if (this.isEditing) {
            commandBill.command = command.id
          } else {
            commandBill.command = command.command_id
          }
          let costs = command.selectRule.cost
          costs.forEach(cost => {
            let expense_item = {
              expense_item: cost.item_id,
              amount: this.moneyYuanToCent(cost.item_total_price),
              pay_methods: []
            }
            _.forIn(cost.pay_methods, (value, key) => {
              if(this.moneyYuanToCent(value)) {
                expense_item.pay_methods.push({
                  method: key,
                  amount: this.moneyYuanToCent(value)
                })
              }
            })
            commandBill.expense_items.push(expense_item)
          })
        }
        if (commandBill.amount > 0) {
          command_bills.push(commandBill)
        }
      })
      // 支付设置
      let isValid = false
      this.$refs['reckoner'].$refs['ruleForm'].validate(async (valid) => {
        isValid = valid
      })
      if (!isValid) return
      let pay_methods = [], payTotalMoney = 0;
      let reckonerData = this.$refs['reckoner'].formData
      reckonerData.payTypes.forEach(pay => {
        payTotalMoney += Number(pay.amount)
        pay_methods.push({
          pay_method: pay.pay_method,
          amount: this.moneyYuanToCent(pay.amount),
          settlement_account: reckonerData.settlement_account,
          settlement_pay_method: reckonerData[pay.id] || 0 // 当其他支付方式时，设置值为0
        })
      })
      // 验证所填金额是否和实际费用一致
      if (this.moneyYuanToCent(payTotalMoney) !== bill.final_amount) {
        this.$message.warning('所填金额与该单据金额不符')
        return
      }
      // 入参postParams
      let postParams = {
        bill,
        command_bills,
        pay_methods
      }
      loading(true)
      this.$refs['baseRuleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          if (this.isEditing) {
            $put(`${api.dispatchBillBorrowing}/${this.edit_id}`, postParams).then(() => {
              loading(false)
              this.$message.success('编辑成功')
              this.$router.push('/borrowing')
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.dispatchBillBorrowing, postParams).then(() => {
              loading(false)
              this.$message.success('创建成功')
              this.$router.push('/borrowing')
            }).catch(() => {
              loading(false)
            })
          }
        } else {
          return false
        }
      })
    },
    // 编辑获取详情回显
    getDetail(id) {
      this.pageLoading = true
      $get(`${api.dispatchBillBorrowing}/${id}`).then(res => {
        const bill = res.bill
        this.pay_methods = res.pay_methods
        this.command_bills = res.command_bills
        this.expenseData.invalid_command_bills = res.invalid_command_bills // 编辑时已被刪除的调令
        this.dispatch = bill.dispatch_display
        this.dispatch_name = this.dispatch.number
        this.dispatchOrderList = [{
          key: this.dispatch.id,
          value: this.dispatch.number
        }]
        this.differenceMoney = bill.amount - bill.final_amount
        this.formData = {
          dispatch: this.dispatch.id,
          bill_type: 'dispatch_borrowing',
          amount: this.moneyCentToYuan(bill.amount),
          repayment: this.moneyCentToYuan(this.differenceMoney),
          final_amount: this.moneyCentToYuan(bill.final_amount)
        }

        this.rememberRepayment = _.cloneDeep(this.formData.repayment)
        if (this.rememberRepayment > 0) {
          this.isRepayment = true
        } else {
          this.isRepayment = false
        }
        this.$nextTick(() => {
          this.getDispatchById()
        })
      })
    }
  },
  created() {
    if(this.$route.query.dispatch_id) {
      this.formData.dispatch = this.$route.query.dispatch_id
      this.dispatchOrderList = [{
        key: this.$route.query.dispatch_id,
        value: this.$route.query.dispatch_name
      }]
      this.getDispatchDetail()
    }
    this.edit_id = this.$route.query.id
    this.isEditing = this.edit_id ? true : false
    if (this.isEditing) {
      // 获取详情
      this.getDetail(this.edit_id)
    }
  }
};
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
  .repayment{
    margin-bottom: 20px;
  }
  .no-settlement-info{
    text-align: center;
    padding: 20px 0;
    p{
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
    }
  }
  .pay-way{
    margin: 0;
    &+.pay-way{
      margin-top: 15px;
    }
    .name{
      display: inline-block;
      min-width: 100px;
      margin-right: 40px;
    }
    .money{
      font-size: 24px;
      font-weight: 700;
      color: $themeColor;
    }
  }

</style>
