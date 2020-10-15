<template>
  <div class="statement-list">
    <div class="statement-item" v-if="!isTotalPrice">
      <h3 class="title">费用总计：</h3>
      <div class="header-line dark"></div>
      <div class="expense-container">
        <ul class="expense-items">
          <li class="item" v-for="(value, key, index) in everyExpenseTotal" :key="index">
            <span>{{key}}：</span>
            <span>{{value | toFixedMonty}}元</span>
          </li>
        </ul>
        <div class="total">
          <span>合计：</span>
          <div class="money">
            <i class="el-icon-info"></i>￥{{resultTotal | toThousandFilter}}
          </div>
        </div>
      </div>
    </div>
    <div class="statement-item" v-for="(bill, index) in bills" :key="index">
      <h3 class="title">
        {{bill.bill_type === 'dispatch_borrowing' ? '借支单' : '补款单'}}：{{bill.bill_number}}
      </h3>
      <div class="header-line dark"></div>
      <div class="expense-container">
        <ul class="expense-items">
          <li class="item" v-for="(item, $index) in bill.expense_items" :key="$index">
            <span>{{item.expense_item_name}}：</span>
            <span>{{moneyCentToYuan(item.amount)}}元</span>
          </li>
        </ul>
        <div class="total">
          <span>合计：</span>
          <span class="money">￥{{moneyCentToYuan(bill.amount) | toThousandFilter}}</span>
        </div>
      </div>
    </div>
    <div class="statement-item">
      <h3 class="title">应结算费用：</h3>
      <div class="header-line orange"></div>
      <div class="expense-container">
        <ul class="expense-items">
          <li class="item">
            <span>总费用：</span>
            <span>{{resultTotal | toFixedMonty}}元</span>
          </li>
          <li class="item">
            <span>借支费用：</span>
            <span>{{statementData.expenseData.borrowing | toFixedMonty}}元</span>
          </li>
          <li class="item">
            <span>补款费用：</span>
            <span>{{statementData.expenseData.supplement | toFixedMonty}}元</span>
          </li>
        </ul>
        <div class="total orange">
          <span>应结算费用：</span>
          <span class="money">￥{{amountToBeSettled | toThousandFilter}}</span>
        </div>
      </div>
    </div>
    <div class="statement-item">
      <h3 class="title">结算备注：</h3>
      <div class="header-line grey"></div>
      <div class="note">
        <el-input
          type="textarea"
          :rows="12"
          placeholder="请输入备注信息"
          v-model="statementData.note">
        </el-input>
      </div>
    </div>
    <div class="statement-item">
      {{data}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    storeModelName: {
      type: String,
      default: ''
    },
    isTotalPrice: {
      type: Boolean,
      default: false
    },
    bills: {
      type: Array,
      default: () => []
    },
    resultTotal: {
      type: Number,
      default: 0
    },
    bankcardTotal: {
      type: Number,
      default: 0
    },
    oilcardTotal: {
      type: Number,
      default: 0
    },
    wjyTotal: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 应结算金额
    amountToBeSettled() {
      return this.resultTotal - this.statementData.expenseData.borrowing - this.statementData.expenseData.supplement
    },
    // 费用总计各费用项金额
    everyExpenseTotal() {
      let obj = {}
      const expenseData = this.$store.state[this.storeModelName].expenseData
      if (expenseData.commands) {
        expenseData.commands.forEach(command => {
          if (command.selectRule) {
            command.selectRule.cost.forEach(item => {
              obj[item.item_name] = (obj[item.item_name] ? Number(obj[item.item_name]) : 0 ) + Number(item.item_total_price)
            })
          }
        })
      }
      return obj
    }
  },
  data() {
    return {
      statementData: {
        expenseData: {
          borrowing: 0,
          supplement: 0
        },
        note: ''
      }
    }
  },
  created() {
    this.bills.forEach(bill => {
      if (bill.bill_type === 'dispatch_borrowing') {
        this.statementData.expenseData.borrowing += this.moneyCentToYuan(bill.amount)
      } else if (bill.bill_type === 'dispatch_supplement') {
        this.statementData.expenseData.supplement += this.moneyCentToYuan(bill.amount)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .statement-item{
    margin-bottom: 22px;
    width: 280px;
    margin-right: 20px;
    float: left;
    .title{
      margin-top: 0;
      margin-bottom: 10px;
    }
    .header-line{
      border-radius: 4px;
      height: 8px;
      border-radius: 5px;
      border-bottom-right-radius: 0px;
      border-bottom-left-radius: 0px;
      &.dark{
        background-color:#464c5b;
      }
      &.orange{
        background-color:#ff6600;;
      }
      &.grey{
        background-color:#c9c9c9;
      }
    }
    .note{
      height: 263px;
      overflow: hidden;
      background-color: #fff;
      box-shadow: 0 0px 12px 0 rgba(0, 0, 0, .1);
    }
  }
  .expense-container{
    background-color: #fff;
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, .1);
  }
  .expense-items{
    width: 100%;
    height: 200px;
    padding: 5px 0;
    margin: 0;
    overflow: auto;
    .item{
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ebeef5;
    }
  }
  .total{
    display: flex;
    padding: 15px;
    align-items: center;
    justify-content: space-between;
    .money{
      font-size: 20px;
    }
    &.orange{
      span{
        color: #ff6600;
      }
    }
  }
</style>
