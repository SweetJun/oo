<template>
  <nf-form-wrap v-if="scene" :on-save-btn-click="onSaveBtnClick">
    <el-radio-group v-model="computeType" v-if="scene === 'borrow'" @change="computeTypeChange">
      <el-radio label="independent">独立计算</el-radio>
      <el-radio label="percent" v-if="expenseCalculationPoint !== 'dispatch_settled'">按总价百分比计算</el-radio>
      <div style="display: inline-block;" v-if="computeType === 'percent'">
        <el-input
          class="percent"
          placeholder="请输入百分比"
          type="number"
          v-model.number="specifics.percent">
          <template slot="append">%</template>
        </el-input>
        <el-tooltip
          class="notice-tip"
          effect="dark"
          :content="tipNotice"
          placement="right">
          <el-button icon="el-icon-info"></el-button>
        </el-tooltip>
      </div>
    </el-radio-group>
    <div class="el-tabs-box">
      <el-button type="primary" class="add-expense_item" @click="addExpenseItem">添加费用</el-button>
      <el-tabs
        class="expense"
        v-model="activeTabName"
        type="card" closable
        @tab-remove="removeTab">
        <el-tab-pane v-for="(item, index) in specifics.expense_items" :key="index" :name="item.item_id">
          <span
            v-if="scene === 'total_price' || (scene === 'borrow' && computeType === 'independent')"
            slot="label">
            {{item.item_name}}
            <span class="badge" v-if="item.condition_groups.length > 0">
              {{item.condition_groups.length}}
            </span>
          </span>
          <span v-else slot="label">{{item.item_name}} <span class="badge">{{item.percent || 0}} %</span></span>
          <div class="tab-pane-content">
            <!-- 场景1 及 场景2的独立计算 -->
            <div v-if="scene === 'total_price' || (scene === 'borrow' && computeType === 'independent')">
              <div class="formula">
                <el-select v-model="item.formula">
                  <el-option
                    v-for="(item, index) in dataSupport.formulas"
                    :key="index"
                    :label="item.value"
                    :value="item.key">
                  </el-option>
                </el-select>
              </div>
              <scene1
                :dataSupport="dataSupport"
                :formula="item.formula"
                :conditionGroups="item.condition_groups"
                @delete-group="(index)=>{deleteConditionGroup(item.condition_groups, index)}"
                @editPayTypes="(index)=>{editPayTypes(item.condition_groups, index)}">
              </scene1>
              <div class="add-conditionGroup">
                <el-button
                  type="primary"
                  @click="addConditionGroup(item.condition_groups)">
                  添加条件组
                </el-button>
              </div>
            </div>

            <!-- 场景2的按总价百分比计算 -->
            <scene2
              v-if="scene === 'borrow' && computeType === 'percent'"
              :percent="item.percent"
              :pay-methods="item.pay_methods"
              @editPayTypes="editPayTypes(item)"
              @update-percent="(val)=>{updatePercent(item, val)}">
            </scene2>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加费用项 -->
    <nf-dialog-expense
      v-if="dialogExpenseItem"
      @update-expense-item="updateExpenseItem"
      :un-expense-items="defaultExpenseItem"
      :dialog-expense-item.sync="dialogExpenseItem">
    </nf-dialog-expense>
    <!-- 修改支付方式 -->
    <nf-select-pay
      v-if="dialogPay"
      :dialog-pay.sync="dialogPay"
      @update-paytype="updatePayType"
      :data="payTypes"
      :select-data="defaultPays">
    </nf-select-pay>
  </nf-form-wrap>
</template>

<script>
import scene1 from './scene1'
import scene2 from './scene2'
export default {
  components: {
    scene1,
    scene2
  },
  props: {
    // 后台数据支持（下拉等）
    dataSupport: {
      type: Object,
      default: () => {}
    },
    scene: {
      type: String,
      default: ''
    },
    expenseCalculationPoint: {
      type: String,
      default: 'dispatch_created'
    }
  },
  data() {
    return {
      activeTabName: '',
      dialogExpenseItem: false,
      defaultExpenseItem: [],
      dialogPay: false,
      defaultPays: [],
      payTypes: [],
      computeType: 'independent',
      specifics: {
        percent: '',
        expense_items: []
      }
    }
  },
  computed: {
    tipNotice: {
      get() {
        let value = Number(this.specifics.percent)
        if (value && value > 0) {
          return `示例：总价是1000元，那么借支总额为 ${1000 * value / 100} 元。`
        } else {
          return `请输入 0-100 百分比值`
        }
      }
    }
  },
  methods: {
    // 当计算方式更改后
    computeTypeChange() {
      this.specifics.expense_items = []
    },
    // 添加费用项
    addExpenseItem() {
      this.dialogExpenseItem = true
      // 默认选中项
      this.defaultExpenseItem = this.specifics.expense_items.map(item => {
        return {
          id: item.item_id,
          name: item.item_name
        }
      })
    },
    // 更新费用项
    updateExpenseItem(val) {
      val.forEach(item => {
        let expenseItem = {}
        // 默认支付方式
        let payMethod = {
          method: item.payment_mode, // 支付方式
          percent: '', // 支付占比
          name: item.payment_mode_name
        }
        if (this.scene === 'borrow' && this.computeType === 'percent') {
          expenseItem = {
            item_id: item.id,
            item_name: item.name,
            percent: '',
            pay_methods: [payMethod]
          }
        } else {
          expenseItem = {
            item_id: item.id,
            item_name: item.name,
            formula: 'normal', // 常规计算
            percent: '',
            condition_groups: [
              {
                price: '',
                unit: 'vehicle',
                pay_methods: [payMethod],
                // 高级条件
                condition: []
              }
            ]
          }
        }
        this.specifics.expense_items.push(expenseItem)
      })
      let length = this.specifics.expense_items.length
      this.activeTabName = length > 0 ? this.specifics.expense_items[length - 1].item_id : ''
    },
    // 删除费用项
    removeTab(targetName) {
      let tabs = this.specifics.expense_items;
      let activeName = this.activeTabName;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.item_id === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.item_id;
            }
          }
        })
      }
      this.activeTabName = activeName
      this.specifics.expense_items = tabs.filter(tab => tab.item_id !== targetName)
    },
    // 点击修改支付方式
    editPayTypes(condition_groups, index) {
      this.payTypes = this.dataSupport.pay_methods
      this.dialogPay = true
      // 选中的支付方式
      if (this.scene === 'borrow' && this.computeType === 'percent') {
        this.payMethods = condition_groups
        this.defaultPays = this.payMethods.pay_methods.map(item => item.method)
      } else {
        this.currentGroup = condition_groups[index]
        this.defaultPays = this.currentGroup.pay_methods.map(item => item.method)
      }
    },
    // 更新支付方式
    updatePayType(pays) {
      let isPercent = this.scene === 'borrow' && this.computeType === 'percent'
      if (isPercent) {
        this.payMethods.pay_methods = []
      } else {
        this.currentGroup.pay_methods = []
      }
      pays.forEach(pay => {
        this.dataSupport.pay_methods.forEach(item => {
          if (pay === item.key) {
            let payItem = {
              method: pay,
              percent: '',
              name: item.value
            }
            if (isPercent) {
              this.payMethods.pay_methods.push(payItem)
            } else {
              this.currentGroup.pay_methods.push(payItem)
            }
            return
          }
        })
      })
    },
    // 添加条件组
    addConditionGroup(condition_groups) {
      condition_groups.push(
        {
          price: '',
          unit: 'vehicle',
          pay_methods: [
            {
              name: '银行转账',
              method: 'bank_card', // 支付方式
              percent: '' // 支付占比
            }
          ],
          // 支付方式
          condition: []
        }
      )
    },
    // 删除条件组
    deleteConditionGroup(condition_groups, index) {
      condition_groups.splice(index, 1)
    },
    // 总价百分比时更新费用项标题处的百分比值
    updatePercent(item, val) {
      item.percent = val
    },
    // 保存
    onSaveBtnClick(loading) {
      //TODO: 先验证， 不通过 return
      this.$emit('save-click', loading)
    }
  },
  created() {
    // this.payTypes = this.dataSupport.pay_methods
  },
  watch: {
    'expenseCalculationPoint'(newVal) {
      if (newVal === 'dispatch_settled') {
        this.computeType = 'independent'
        this.specifics.expense_items = []
      }
    },
    'specifics.expense_items'() {
      setTimeout(() => {
        let hasTab = document.querySelector('.expense .el-tabs__nav')
        let tabsScrollWidth = 0
        if (hasTab) {
          tabsScrollWidth = hasTab.scrollWidth + 10 + 'px'
        } else {
          tabsScrollWidth = 0
        }
        document.querySelector('.el-tabs-box .add-expense_item').style.left = tabsScrollWidth
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
  .formula{
    margin-bottom: 15px;
    margin-left: 5px;
  }
  .notice-tip /deep/{
    padding: 0;
    border: 0;
    margin-left: 10px;
    .el-icon-info{
      font-size: 24px;
      vertical-align: middle;
    }
  }
  .el-radio-group{
    margin-bottom: 15px;
  }
  .el-tabs-box{
    position: relative;
    min-height: 36px;
  }
  .add-expense_item{
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 12px;
    z-index: 20;
  }
  .badge{
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
    margin-left: 4px;
  }
  .percent /deep/{
    width: 145px;
    .el-input-group__append{
      padding: 0 5px;
    }
  }
  .add-conditionGroup{
    margin-left: 5px;
  }
</style>
