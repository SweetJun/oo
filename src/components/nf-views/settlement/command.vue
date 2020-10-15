<template>
  <div>
    <div class="commands">
      <div class="no-expense" v-if="expenseData.commands.length === 0">
        <p>请选择调度单</p>
      </div>
      <el-form v-else :model="expenseData" ref="expenseForm" inline label-position="top">
        <div class="command-item" v-for="(command, index) in expenseData.commands" :key="index">
          <div class="item-left">
            <div class="left-top">
              <h4>{{command.from_display}} — {{command.to_display}}</h4>
              <span class="mileage">{{command.carry_type_display}} - {{command.mileage}}km</span>
            </div>
            <div class="borrowing-type">
              <span class="label">结算政策：</span>
              <div class="borrowing-policy">
                <nf-select
                  class="nf-select"
                  value-key="id"
                  placeholder="请选择结算政策"
                  :clearable="false"
                  :options="command.ruleList"
                  :props="{key: 'id', value: 'name'}"
                  :value.sync="command.selectRule"
                  @change="ruleChange(command)">
                </nf-select>
                <el-button type="primary" @click="addExpenseItem(command.selectRule)">添加费用</el-button>
              </div>
              <div class="sum">费用合计：<span>{{(command.selectRule.total_price) | toThousandFilter}}</span> 元</div>
            </div>
          </div>
          <div class="line"></div>
          <div class="item-right">
            <div class="expense-container">
              <el-form-item
                v-for="(item, $index) in command.selectRule.cost" :key="$index"
                :prop="'commands.' + index + '.selectRule.cost.' + $index + '.item_total_price'"
                :rules="[
                  {validator: $valid.isFloatNumber(true, '请输入金额'), trigger: 'blur'}
                ]">
                <div class="item-label">
                  <span class="label">{{item.item_name}}</span>
                  <el-button
                    v-if="expenseCanSetting"
                    type="text"
                    class="setting"
                    @click="expenseSetting(command.selectRule, item)">
                    设置
                  </el-button>
                  <el-button
                    type="text danger"
                    icon="el-icon-delete"
                    @click="deleteExpense(command.selectRule, $index)">
                  </el-button>
                </div>
                <el-input
                  placeholder="请输入金额"
                  v-model="item.item_total_price"
                  @change="inputChange(command.selectRule, item)">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <div class="dispatch-deleted" v-if="expenseData.invalid_command_bills.length > 0">
        <h5 class="explain">以下是已删除的调令</h5>
        <div class="command-item delete" v-for="(command, index) in expenseData.invalid_command_bills" :key="index">
          <div class="item-left">
            <div class="left-top">
              <h4>{{command.from_display}} — {{command.to_display}}</h4>
              <span class="mileage">{{command.carry_type_display}} - {{command.mileage}}km</span>
            </div>
          </div>
          <div class="item-right">
            <div style="font-size: 16px;">费用合计：<span>{{moneyCentToYuan(command.bill.amount) | toThousandFilter}}</span> 元</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加费用项 -->
    <nf-dialog-expense
      v-if="dialogExpenseItem"
      :un-expense-items="defaultExpenseItem"
      @update-expense-item="updateExpenseItem"
      :dialog-expense-item.sync="dialogExpenseItem">
    </nf-dialog-expense>
    <!-- 费用项设置 -->
    <expense-setting
      :dialog-expense.sync="dialogExpense"
      :expense="expenseInfo"
      @set-success="setSuccess">
    </expense-setting>
  </div>
</template>

<script>
/**
 * @Description: 借支补款单等有关调令及费用项公用组件
 * @Author: wjw
 * @Date: 2020-04-26 15:15:00
 */
import expenseSetting from './expenseSetting'
export default {
  components: {
    expenseSetting
  },
  props: {
    storeModelName: {
      type: String,
      default: ''
    },
    expenseData: {
      type: Object,
      default: () => {}
    },
    // 可否设置费用项
    expenseCanSetting: {
      type: Boolean,
      default: true
    },
    // 存在借支费用
    noBorrowingItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogExpenseItem: false,
      dialogExpense: false,
      expenseInfo: {},
      defaultExpenseItem: [],
      payMethodTotal: {
        bank_card: 0,
        oil_card: 0,
        wjy: 0
      }
    }
  },
  methods: {
    // 计算所有调令各种支付方式金额总和
    // 在支付设置里显示
    computeAllPayMoney() {
      this.payMethodTotal = {
        bank_card: 0,
        oil_card: 0,
        wjy: 0,
        default: 0
      }
      this.expenseData.commands.forEach(command => {
        if (command.selectRule) {
          command.selectRule.cost.forEach(item => {
            _.forIn(item.pay_methods, (value, key) => {
              this.payMethodTotal[key] += Number(item.pay_methods[key])
            })
          })
        }
      })
      this.$store.commit(`${this.storeModelName}/updatePayMethodTotal`, this.payMethodTotal)
    },
    // 计算各调令费用总和
    computeSumMoney(currentRule) {
      if (currentRule.cost) {
        currentRule.total_price = 0
        currentRule.cost.forEach(item => {
          currentRule.total_price += Number(item.item_total_price)
        })
      }
      this.computeAllPayMoney()
    },
    // 借支策略变更
    ruleChange(command) {
      // 非当做借支的金额添加到相应的费用项上
      this.addNoBorrowingToExpense(command)
      this.$store.commit(`${this.storeModelName}/updateExpenseData`, this.expenseData)
    },
    // 非当做借支的金额添加到相应的费用项上
    // command 当前调令
    addNoBorrowingToExpense(command) {
      let cost = command.selectRule.cost
      if (this.noBorrowingItems.length > 0) {
        this.noBorrowingItems.forEach(noItem => {
          if (noItem.command === command.command_id) {
            noItem.expense_items.forEach(expenseitem => {
              let index = _.findIndex(cost, item => item.item_id === expenseitem.expense_item_id)
              if (index > -1) {
                cost[index].item_total_price = expenseitem.amount + cost[index].item_total_price
                this.inputChange(command.selectRule, cost[index])
              } else {
                cost.push({
                  item_id: expenseitem.expense_item_id,
                  item_name: expenseitem.expense_item_name,
                  item_total_price: expenseitem.amount,
                  pay_methods: {}
                })
              }
            })
          }
        })
      }
      this.computeSumMoney(command.selectRule)
    },
    // 根据费用项初始的金额比例分配更新后的金额
    setMoneyByPercent(item) {
      // 按各支付方式的百分比计算
      let flag = false, oldTotalMoney = 0
      _.forIn(item.pay_methods, (value) => {
        // 从这里计算出费用项 修改前的总金额
        oldTotalMoney += Number(value)
        if (Number(value) > 0) {
          flag = true
        }
      })
      if (flag) {
        _.forIn(item.pay_methods, (value, key) => {
          let itemMoney = Number(value)
          let percent = Number((itemMoney / oldTotalMoney).toFixed(2))
          if (percent > 0) {
            item.pay_methods[key] = Number((percent * item.item_total_price).toFixed(2))
          }
        })
        this.computeSumMoney(this.selectRule)
      } else {
        // 无初始分配时
        $get(`${api.expense}/${item.item_id}`).then(res => {
          this.$set(item, 'defaultPay', res.payment_mode)
          _.forIn(item.pay_methods, (value, key) => {
            item.pay_methods[key] = ''
          })
          item.pay_methods[item.defaultPay] = item.item_total_price

          this.computeSumMoney(this.selectRule)
        })
      }
    },
    // 当费用的值改变后，重新计算
    inputChange(selectRule, item) {
      this.selectRule = selectRule
      this.setMoneyByPercent(item)
      this.$store.commit(`${this.storeModelName}/updateExpenseData`, this.expenseData)
    },
    // 添加费用项
    addExpenseItem(selectRule) {
      if (!selectRule.cost) {
        this.$message.warning('请先选择借支策略！')
        return
      }
      // 已经选过的，禁用选择
      this.defaultExpenseItem = selectRule.cost.map(item => {
        return {
          id: item.item_id,
          name: item.item_name
        }
      })
      this.currentRule = selectRule
      this.dialogExpenseItem = true
    },
    // 添加更新费用项
    updateExpenseItem(val) {
      val.forEach(item => {
        let expenseItem = {}
        expenseItem = {
          item_id: item.id,
          item_name: item.name,
          item_total_price: '',
          pay_methods: {
            bank_card: '',
            oil_card: '',
            wjy: '',
            default: ''
          }
        }
        this.currentRule.cost.push(expenseItem)
      })
    },
    // 设置费用项
    expenseSetting(selectRule, item) {
      this.expenseInfo = item
      this.currentRule = selectRule
      this.dialogExpense = true
    },
    // 设置费用项成功
    setSuccess(data) {
      this.expenseInfo = data
      this.computeSumMoney(this.currentRule)
    },
    // 删除费用项
    deleteExpense(selectRule, index) {
      selectRule.cost.splice(index, 1)
      this.currentRule = selectRule
      this.computeSumMoney(this.currentRule)
    }
  },
  mounted() {
    if (this.noBorrowingItems.length > 0) {
      this.expenseData.commands.forEach(command => {
        this.addNoBorrowingToExpense(command)
      })
    }
    setTimeout(() => {
      this.$store.commit(`${this.storeModelName}/updateExpenseData`, this.expenseData)
    })
  }
};
</script>

<style lang="scss" scoped>
  .command-item{
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    padding: 20px;
    position: relative;
    display: flex;
    &.delete{
      border: 1px solid #F56C6C;
    }
    &+.command-item{
      margin-top: 20px;
    }
    .line{
      left: 440px;
      top: 20px;
      bottom: 20px;
      width: 1px;
      position: absolute;
      background-color: #dcdfe6;
    }
  }
  .dispatch-deleted{
    margin-top: 20px;
  }
  .item-left{
    width: 420px;
    float: left;
    display: block;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .left-top{
    display: flex;
    justify-content: space-between;
    h4{
      margin: 0;
      font-size: 16px;
    }
    .mileage{
      background-color: rgb(255, 153, 0);
      border-radius: 5px;
      padding: 4px 5px;
      font-size: 12px;
      color: #fff;
    }
  }
  .borrowing-policy{
    .nf-select{
      width: 240px;
    }
  }
  .borrowing-type{
    margin-top: 10px;
    .label{
      display: inline-block;
      margin-bottom: 10px;
    }
    .el-button{
      margin-left: 20px;
    }
  }
  .item-right{
    padding-left: 20px;
    box-sizing: border-box;
    flex: 1;
  }
  .sum{
    font-size: 20px;
    margin-top: 20px;
    span{
      color: $themeColor;
    }
  }
  .item-label{
    .el-button{
      margin-left: 5px;
    }
  }
  .explain{
    font-size: 14px;
    color: #F56C6C;
    margin: 0 0 10px 0;
  }
  .expense-container{
    .el-form-item{
      width: 200px;
      margin-bottom: 10px;
    }
    .danger{
      float: right;
      margin-right: 8px;
    }
  }
  .no-expense{
    text-align: center;
    font-size: 20px;
  }
</style>
