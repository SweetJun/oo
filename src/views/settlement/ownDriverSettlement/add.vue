<template>
  <div v-loading="pageLoading">
    <nf-form-wrap title="结算管理" :show-footer="false">
      <el-form :model="formData" ref="baseRuleForm" :rules="formRules" inline label-position="top">
        <div class="dispatch">
          <el-form-item label="选择调度单：" prop="dispatch">
            <nf-select
              placeholder="请输入调度单选择"
              :disabled="true"
              :options="dispatchOrderList"
              search-key="dispatch_number"
              :value.sync="formData.dispatch"
              @change="getDispatchDetail">
            </nf-select>
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
    <!-- 算总价结算 -->
    <total-price
      v-if="isTotalPrice"
      :totalPrice="resultTotal"
      @updateTotalPriceMoney="updateTotalPriceMoney"
      :commands="expenseData.commands">
      </total-price>
    <!-- 非算总价结算 -->
    <nf-form-wrap  v-if="!isTotalPrice" title="调令单据" :show-footer="false">
      <command
        ref="commands"
        v-if="expenseData.commands.length > 0"
        :expense-data="expenseData"
        :noBorrowingItems="noBorrowingItems"
        :expenseCanSetting="false"
        :storeModelName='storeModelName'>
      </command>
    </nf-form-wrap>
    <nf-form-wrap title="费用信息" :show-footer="false" v-if="dataFinished">
      <statement-list
        ref="statementList"
        :isTotalPrice="isTotalPrice"
        :storeModelName='storeModelName'
        :resultTotal="resultTotal"
        :bills="bills">
      </statement-list>
    </nf-form-wrap>
    <nf-form-wrap title="支付设置" v-if="finishReckoner"  :on-save-btn-click="onSaveBtnClick">
      <div class="no-settlement-info" v-if="reckonerList.length === 0">
        <p>当前驾驶员没有结算信息，请先关联结算人。</p>
        <el-button type="primary" @click="dialogReckoner = true">关联结算人</el-button>
      </div>
      <div v-else>
        <div
          class="repayment"
          v-if="(repayment > 0 && amountToBeSettled > 0) || (repayment < 0 && amountToBeSettled < 0)">
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
            <span class="name">合计：</span>
            <span class="money">{{amountToBeSettled| toThousandFilter}}</span> 元
          </p>
          <p class="pay-way" v-if="isRepayment">
            <span class="name">抵扣金额：</span>
            <span class="money">{{formData.repayment | toThousandFilter}}</span> 元
          </p>
          <p class="pay-way">
            <span class="name">实际支付费用：</span>
            <span class="money">{{amountToBeSettled - formData.repayment | toThousandFilter}}</span> 元
          </p>
        </div>
        <reckoner
          ref="reckoner"
          v-if="amountToBeSettled - formData.repayment > 0"
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
import totalPrice from '@/components/nf-views/settlement/totalPrice'
import reckoner from '@/components/nf-views/settlement/reckoner'
import statementList from '@/components/nf-views/settlement/statementList'
export default {
  components: {
    command,
    totalPrice,
    reckoner,
    statementList
  },
  data() {
    return {
      storeModelName: 'ownDriverSettlementModule',
      pageLoading: false,
      isEditing: false,
      dialogReckoner: false,
      dispatchOrderList: [],
      dispatch: {},
      bills: [], // 用于显示的借支和补款单
      isRepayment: false, // 是否需要抵扣
      repayment: 0, // 待抵扣金额
      differenceMoney: 0, // 抵扣金额
      commands: [],
      noBorrowingItems: [], // 存在借支费用
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
      },
      dataFinished: false,
      isTotalPrice: false, // 是否是算总价模式
      totalPriceMoney: 0
    }
  },
  computed: {
    resultTotal() {
      if (this.isTotalPrice) {
        return Number(Number(this.totalPriceMoney).toFixed(2))
      } else {
        let money = 0
        const expenseData = this.$store.state[this.storeModelName].expenseData
        if (expenseData.commands) {
          expenseData.commands.forEach(command => {
            if (command.selectRule) {
              money += Number(command.selectRule.total_price)
            }
          })
        }
        return Number(money.toFixed(2))
      }
    },
    // 应结算金额
    amountToBeSettled() {
      if (this.$refs['statementList']) {
        let statementData = this.$refs['statementList'].statementData
        return this.resultTotal - statementData.expenseData.borrowing - statementData.expenseData.supplement
      }
      return 0
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
        this.commands = res.commands
        this.getRepaymentByTruck()
        this.getSettlementPreviousBills()
      })
    },
    // 子组件改变totalPriceMoney
    updateTotalPriceMoney(money) {
      this.totalPriceMoney = money
    },
    // 根据调度单获取借支和补款单据
    getSettlementPreviousBills() {
      let url = `${api.dispatch}/${this.formData.dispatch}/settlement/previous/bills`
      $get(url).then(res => {
        this.dataFinished = true
        if (res.preset_settlement_amount && res.preset_settlement_amount > 0) {
          this.isTotalPrice = true
          if (!this.isEditing) {
            this.totalPriceMoney = this.moneyCentToYuan(res.preset_settlement_amount)
          }else {
            this.totalPriceMoney = this.formData.amount
            res.bills.forEach(item => {
              this.totalPriceMoney += this.moneyCentToYuan(item.amount)
            })
          }
        } else {
          this.isTotalPrice = false
        }

        this.bills = res.bills || []
        this.noBorrowingItems = res.command_non_as_borrowing_items || []
        // 分转化元
        this.noBorrowingItems.forEach(item => {
          item.expense_items.forEach(expense_item => {
            expense_item.amount = this.moneyCentToYuan(expense_item.amount)
          })
        })
        this.$nextTick(() => {
          this.getReckonerInfo()
          this.getExpenseRule()
          if (this.isEditing) {
            this.$refs['statementList'].statementData.note = this.bill.note
          }
        })
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
        if (this.amountToBeSettled - this.formData.repayment <= 0) return
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
          if (this.pay_methods.length > 0) {
            settleData = Object.assign({}, settleData, this.pay_methods[0].settlement_account_display)
          }
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
          },500)
        }
      })
    },
    // 获取计费策略匹配
    getExpenseRule() {
      let params = {
        transport_type: this.dispatch.transport_type,
        dispatch_id: this.dispatch.id,
        scene: 'total_price',
        carry_type: this.dispatch.dispatch_type
      }
      $post(api.expenseRuleMatching, params).then(res => {
        this.pageLoading = false
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
                  let percent = (value/_cost.item_total_price).toFixed(2)
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
                this.$set(item, 'command_id', command.id)
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
          this.$store.commit(`${this.storeModelName}/updateExpenseData`, this.expenseData)
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
          this.$store.commit(`${this.storeModelName}/updateExpenseData`, this.expenseData)
        }
        if (!this.isTotalPrice) {
          this.$nextTick(() => {
            // 计算总和
            this.$refs['commands'].computeAllPayMoney()
          })
        }
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
      // 借支单主体信息
      let amountToBeSettled = this.$refs['statementList'].amountToBeSettled // 合计应付
      let repayment = this.repayment // 可抵扣金额
      let repaymented = Number(this.formData.repayment) // 所填抵扣的金额
      let bill = {
        dispatch: this.formData.dispatch,
        bill_type: 'dispatch_settlement',
        amount: this.moneyYuanToCent(amountToBeSettled),
        repayment: this.isRepayment ? this.moneyYuanToCent(repaymented) : 0, // 所填的
        note: this.$refs['statementList'].statementData.note
      }
      // 如果要操作抵扣，抵扣的金额不能大于/小于应付金额（验证）
      if(this.isRepayment) {
        if (amountToBeSettled > 0 && repayment > 0) {
          if (amountToBeSettled - repaymented >= 0 && repaymented <= repayment) {
            bill.final_amount = this.moneyYuanToCent(amountToBeSettled - repaymented)
          } else {
            this.$message.warning('抵扣金额不能大于实付金额，请重新输入!')
            return
          }
        } else if (amountToBeSettled < 0 && repayment < 0) {
          if (amountToBeSettled - repayment >= 0 && Math.abs(repaymented) <= Math.abs(repayment)) {
            bill.final_amount = this.moneyYuanToCent(amountToBeSettled - repaymented)
          } else {
            this.$message.warning('抵扣金额不能大于实付金额，请重新输入!')
            return
          }
        } else {
          bill.final_amount = this.moneyYuanToCent(amountToBeSettled)
        }
      }else {
        bill.final_amount = this.moneyYuanToCent(amountToBeSettled)
      }
      let pay_methods = []
      if(Number(bill.final_amount) > 0) {
        // 支付设置
        let isValid = false
        this.$refs['reckoner'].$refs['ruleForm'].validate(async (valid) => {
          isValid = valid
        })
        if (!isValid) return
        let payTotalMoney = 0
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
      // 入参postParams
      let postParams = {
        bill,
        command_bills,
        pay_methods
      }
      this.$refs['baseRuleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          if (this.isEditing) {
            $put(`${api.dispatchBillSettlement}/${this.edit_id}`, postParams).then(() => {
              loading(false)
              this.$message.success('编辑成功')
              this.$router.back()
            }).catch(() => {
              loading(false)
            })
          } else {
            $post(api.dispatchBillSettlement, postParams).then(() => {
              loading(false)
              this.$message.success('创建成功')
              this.$router.back()
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
      $get(`${api.dispatchBillSettlement}/${id}`).then(res => {
        const bill = this.bill = res.bill
        this.pay_methods = res.pay_methods
        this.command_bills = res.command_bills
        this.expenseData.invalid_command_bills = res.invalid_command_bills // 编辑时已被刪除的调令
        this.dispatch = bill.dispatch_display
        this.dispatchOrderList = [{
          key: this.dispatch.id,
          value: this.dispatch.number
        }]
        this.totalPriceMoney = this.moneyCentToYuan(bill.amount)
        this.differenceMoney = bill.amount - bill.final_amount
        this.formData = {
          dispatch: this.dispatch.id,
          bill_type: 'dispatch_settlement',
          amount: this.moneyCentToYuan(bill.amount),
          repayment: this.moneyCentToYuan(bill.amount - bill.final_amount),
          final_amount: this.moneyCentToYuan(bill.final_amount)
        }

        this.rememberRepayment = _.cloneDeep(this.formData.repayment)
        if (this.rememberRepayment !== 0) {
          this.isRepayment = true
        } else {
          this.isRepayment = false
        }
        this.getDispatchById()
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
  .no-settlement-info{
    text-align: center;
    padding: 20px 0;
    p{
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 20px;
    }
  }
  .repayment{
    margin-bottom: 20px;
    .el-radio-group{
      margin: 10px 0;
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
