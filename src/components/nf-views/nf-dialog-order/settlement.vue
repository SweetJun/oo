<template>
  <nf-dialog
    title="结算单详情"
    saveBtnText="打印"
    :dialog-visible.sync="receiptDialog"
    v-if="receiptDialog"
    width="1000px"
    :click-sure-btn="clickSureBtn"
    :isCenter="true"
    @close="dialogClose"
    class="nf-dialog"
  >
    <div class="receipt-content print-content" slot="content" id="printSettlement">
      <div class="header">
        <p>结算单号：{{content.bill.bill_number}}</p>
        <p>调度单号：{{content.bill.dispatch_display.number}}</p>
        <p>承运类型：{{content.bill.dispatch_display.transport_type_display}}</p>
        <!-- <p>万金油主体：</p> -->
      </div>
      <table border="1" cellspacing="0" cellpadding="0">
        <tr>
          <td class="tb-label">驾驶员姓名</td>
          <td>{{content.bill.dispatch_display.truck_driver_name}}</td>
          <td class="tb-label">驾驶员手机号</td>
          <td>{{content.bill.dispatch_display.truck_driver_mobile}}</td>
          <td class="tb-label">车牌号</td>
          <td>{{content.bill.dispatch_display.truck_tractor_number}}</td>
          <td class="tb-label"></td>
          <td></td>
        </tr>
        <template v-for="(item,index) in content.command_bills">
          <tr :key="index">
            <td class="tb-label">出发地{{index+1}}</td>
            <td>{{item.from_display}}</td>
            <td class="tb-label">目的地{{index+1}}</td>
            <td>{{item.to_display}}</td>
            <td class="tb-label">里程（km）</td>
            <td>{{item.mileage}}</td>
            <td class="tb-label">行驶类型</td>
            <td>{{item.carry_type_display}}</td>
          </tr>
          <template
            v-if="item.bill.hasOwnProperty('expense_items')&&item.bill.expense_items.length>0"
          >
            <tr v-for="num in Math.ceil(item.bill.expense_items.length/4)" :key="num">
              <template>
                <template
                  v-for="(ele,bilindex) in item.bill.expense_items.slice((num-1)*4,num*4<=item.bill.expense_items.length?num*4:item.bill.expense_items.length)"
                >
                  <td :key="bilindex" class="tb-label">{{ele.expense_item_display}}</td>
                  <td :key="bilindex">{{moneyCentToYuan(ele.amount)|toThousandFilter}}元</td>
                </template>
                <template v-if="num*4>item.bill.expense_items.length">
                  <td v-for="placetd in (4-item.bill.expense_items.length%4)*2" :key="placetd"></td>
                </template>
              </template>
            </tr>
          </template>
        </template>
        <tr v-if="Number(sumMoney)>0">
          <td class="tb-label">合计费用</td>
          <td colspan="7" style="text-align:left;padding-left:10px;line-height:18px;">
            <span>{{moneyCentToYuan(sumMoney)|toThousandFilter}}元</span>&nbsp;
            <span v-if="JSON.stringify(chargeDetails) !== '{}'">（</span>
            <span
              v-for="(item,key) in chargeDetails"
              :key="key"
            >{{item.expense_item_display}}：{{moneyCentToYuan(item.sumMoney)|toThousandFilter}}元；&emsp;</span><span v-if="JSON.stringify(chargeDetails) !== '{}'">）</span>
          </td>
        </tr>
        <tr v-if="Number(borrow)>0">
          <td class="tb-label">借支费用</td>
          <td colspan="7" style="text-align:left;padding-left:10px;line-height:18px;">
            <span>{{moneyCentToYuan(borrow)|toThousandFilter}}元</span>&nbsp;
            <span v-if="JSON.stringify(borrowItems) !== '{}'">（</span>
            <span
              v-for="(item,key) in borrowItems"
              :key="key"
            >{{item.expense_item_display}}：{{moneyCentToYuan(item.sumMoney)|toThousandFilter}}元；&emsp;</span><span v-if="JSON.stringify(borrowItems) !== '{}'">）</span>
          </td>
        </tr>
        <tr v-if="Number(supplement)>0">
          <td class="tb-label">补款费用</td>
          <td colspan="7" style="text-align:left;padding-left:10px;line-height:18px;">
            <span>{{moneyCentToYuan(supplement)|toThousandFilter}}元</span>&nbsp;
            <span v-if="JSON.stringify(supplementItems) !== '{}'">（</span>
            <span
              v-for="(item,key) in supplementItems"
              :key="key"
            >{{item.expense_item_display}}：{{moneyCentToYuan(item.sumMoney)|toThousandFilter}}元；&emsp;</span><span v-if="JSON.stringify(supplementItems) !== '{}'">）</span>
          </td>
        </tr>
        <tr>
          <td class="tb-label">应付费用</td>
          <td colspan="7" style="text-align:left;padding-left:10px;line-height:18px;">
            <span>{{moneyCentToYuan(content.bill.amount)|toThousandFilter}}元</span>&nbsp;
          </td>
        </tr>
        <tr v-if="content.bill.amount-content.bill.final_amount > 0">
          <td class="tb-label">抵扣费用</td>
          <td colspan="7" style="text-align:left;padding-left:10px;line-height:18px;">
            <span>{{moneyCentToYuan(content.bill.amount-content.bill.final_amount)|toThousandFilter}}元</span>&nbsp;
          </td>
        </tr>
        <tr>
          <td class="tb-label">实付费用</td>
          <td colspan="7" style="text-align:left;padding-left:10px;line-height:18px;">
            <span>{{moneyCentToYuan(content.bill.final_amount)|toThousandFilter}}元</span>&nbsp;
          </td>
        </tr>
        <template
          v-if="pay_methods_arr.length>0"
        >
          <tr v-for="num in Math.ceil(pay_methods_arr.length/4)" :key="num">
            <template>
              <template
                v-for="(ele,bilindex) in pay_methods_arr.slice((num-1)*4,num*4<=pay_methods_arr.length?num*4:pay_methods_arr.length)"
              >
                <td :key="bilindex" class="tb-label">{{ele.key}}</td>
                <td :key="bilindex">{{ele.value}}</td>
              </template>
              <template v-if="num*4>pay_methods_arr.length">
                <td v-for="placetd in (4-pay_methods_arr.length%4)*2" :key="placetd"></td>
              </template>
            </template>
          </tr>
        </template>
        <tr>
          <td class="tb-label">银行卡</td>
          <td>{{moneyCentToYuan(paySum.bank_card)|toThousandFilter}}元</td>
          <td class="tb-label">油卡</td>
          <td>{{moneyCentToYuan(paySum.oil_card)|toThousandFilter}}元</td>
          <td class="tb-label">万金油</td>
          <td>{{moneyCentToYuan(paySum.wjy)|toThousandFilter}}元</td>
          <td class="tb-label">其他</td>
          <td>{{moneyCentToYuan(paySum.default)|toThousandFilter}}元</td>
        </tr>
      </table>
      <div style="display:flex;justify-content:space-between;">
        <div class="line-flex">
          <p>制单人：{{curUserName}}</p>
          <p>制单时间：{{curTime}}</p>
        </div>
        <div class="line-flex">
          <p>申请人：{{content.bill.creator_id_display}}</p>
          <p>申请时间：{{content.bill.create_time_display}}</p>
        </div>
      </div>
      <!-- <div class="line-flex">
        <p>审核人：</p>
        <p class="f-val"></p>
      </div>-->
    </div>
  </nf-dialog>
</template>
<script>

export default {
  name: "borrow",
  props: {
    receiptDialog: {
      type: Boolean,
      default: false
    },
    content: {
      type: JSON,
      default: {}
    }
  },
  computed: {
    curUserName: function() {
      return this.$store.state.user.userInfo.name;
    },
    moneyGather: function() {
      return _.map(_.cloneDeep(this.content.command_bills), "bill");
    },
    // 合计费用总计
    sumMoney: function() {
      return _.sum(_.compact(_.map(this.moneyGather, "amount")));
    },
    // 单项费用合计
    chargeDetails: function() {
      let data = _.flatten(_.compact(_.map(this.moneyGather, "expense_items")));
      let sumItem = {};
      _.uniq(_.map(data, "expense_item")).map(ele => {
        sumItem[ele] = {
          sumMoney: 0,
          expense_item_display: ""
        };
      });
      data.map(ele => {
        for (let item in sumItem) {
          if (ele.expense_item === parseInt(item)) {
            sumItem[item].sumMoney += ele.amount;
            sumItem[item].expense_item_display = ele.expense_item_display;
          }
        }
      });
      return sumItem;
    },
    // 渲染账号用
    pay_methods_arr: function() {
      let pay_methods = _.cloneDeep(this.content.pay_methods)
      let pay_methods_arr = []
      pay_methods.forEach(item => {
        switch(item.pay_method) {
          case 'bank_card':
            pay_methods_arr.push({key: '开户银行',value: item.settlement_pay_method_display.bank_id_display})
            pay_methods_arr.push({key: '银行卡号',value: item.settlement_pay_method_display.bank_card})
            break;
          case 'oil_card':
            pay_methods_arr.push({key: '油卡品牌',value: item.settlement_pay_method_display.card_brand_display})
            pay_methods_arr.push({key: '油卡卡号',value: item.settlement_pay_method_display.card_number})
            break;
          case 'wjy':
            pay_methods_arr.push({key: '万金油账号',value: item.settlement_pay_method_display.account})
            break;
        }
      })
      pay_methods_arr.unshift({key: '收款人手机号',value: this.content.bill.dispatch_display.truck_driver_mobile})
      pay_methods_arr.unshift({key: '收款人姓名',value: this.content.bill.dispatch_display.truck_driver_name})
      return pay_methods_arr;
    },
    pay_methods: function() {
      return _.cloneDeep(this.content.pay_methods);
    },
    // 银行卡付款合计
    paySum: function() {
      // let data = _.flatten(
      //   _.map(
      //     _.flatten(_.compact(_.map(this.moneyGather, "expense_items"))),
      //     "pay_methods"
      //   )
      // );
      // let sumItem = {};
      // _.uniq(_.map(data, "method")).map(ele => {
      //   sumItem[ele] = 0;
      // });
      // data.map(ele => {
      //   for (let item in sumItem) {
      //     if (ele.method === item) {
      //       sumItem[item] += ele.amount;
      //     }
      //   }
      // });
      let pay_methods = _.cloneDeep(this.content.pay_methods)
      let sumItem = {}
      pay_methods.forEach(item => {
        switch(item.pay_method) {
          case 'bank_card':
            sumItem['bank_card'] = item.amount
            break;
          case 'oil_card':
            sumItem['oil_card'] = item.amount
            break;
          case 'wjy':
            sumItem['wjy'] = item.amount
            break;
          case 'default':
            sumItem['default'] = item.amount
            break;
        }
      })
      return sumItem;
    }
  },
  data() {
    return {
      curTime: "",
      borrow: '',
      borrowItems: {},
      supplement: '',
      supplementItems: {}
    };
  },
  created() {
    this.curTime = moment().format("YYYY-MM-DD HH:mm:ss");
    //
    let url = `${api.dispatch}/${this.content.bill.dispatch}/settlement/previous/bills`
    $get(url).then(res => {
      // 借支费用
      this.borrow = _.sum(_.map(_.filter(res.bills, item => {return item.bill_type === 'dispatch_borrowing'}),'amount'))
      // 借支费用项
      let data = _.flatten(_.compact(_.map(_.filter(res.bills, item => {return item.bill_type === 'dispatch_borrowing'}), "expense_items")));
      let sumItem = {};
      _.uniq(_.map(data, "expense_item_name")).map(ele => {
        // ele是费用项名称
        sumItem[ele] = {
          sumMoney: 0,
          expense_item_display: ""
        };
      });
      data.map(ele => {
        for (let item in sumItem) {
          if (ele.expense_item_name === item) {
            sumItem[item].sumMoney += ele.amount;
            sumItem[item].expense_item_display = ele.expense_item_name;
          }
        }
      });
      this.borrowItems = sumItem
      // 补款费用
      this.supplement = _.sum(_.map(_.filter(res.bills, item => {return item.bill_type === 'dispatch_supplement'}),'amount'))
      // 补款费用项
      let data1 = _.flatten(_.compact(_.map(_.filter(res.bills, item => {return item.bill_type === 'dispatch_supplement'}), "expense_items")));
      let sumItem1 = {};
      _.uniq(_.map(data1, "expense_item_name")).map(ele => {
        // ele是费用项名称
        sumItem1[ele] = {
          sumMoney: 0,
          expense_item_display: ""
        };
      });
      data1.map(ele => {
        for (let item in sumItem1) {
          if (ele.expense_item_name === item) {
            sumItem1[item].sumMoney += ele.amount;
            sumItem1[item].expense_item_display = ele.expense_item_name;
          }
        }
      });
      this.supplementItems = sumItem1
    })
  },
  methods: {
    // 打印
    clickSureBtn() {
      this.$print('printSettlement', '结算单详情')
    },
    // 弹框关闭事件
    dialogClose() {
      this.receiptDialog = false;
      this.$emit("update:receiptDialog", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.receipt-content {
  .header {
    display: flex;
    justify-content: space-around;
    p{
      margin: 10px 0;
    }
  }
  table {
    width: 100%;
    border-color: #f2f2f2;
    tr {
      td:nth-of-type(2n+1) {
        background: #f5f5f5;
      }
    }
    td {
      width: 125px;
      font-size: 12px;
      padding: 5px 10px;
      text-align: left;
    }
    .tb-label {
      background: #f5f5f5;
    }
  }
}
.line-flex {
  display: flex;
  margin-top: 10px;
  p {
    margin: 0;
    &+p{
      margin-left: 30px;
    }
  }
}
</style>
