<template>
  <div>
    <el-tabs v-model="payType" @tab-click="payTypeChange">
      <el-tab-pane label="未生效" name="inactive"></el-tab-pane>
      <el-tab-pane label="未打款" name="ready"></el-tab-pane>
      <el-tab-pane label="已打款" name="complete"></el-tab-pane>
      <el-tab-pane label="无需打款" name="invalid"></el-tab-pane>
    </el-tabs>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :table-operation="tableOperation"
    >
      <div class="table-top-left" slot="top-btn-left" v-if="roles['client_rule_add']">
        <el-button size="medium" type="primary" icon="el-icon-plus" @click="handleAddPrice">添加</el-button>
      </div>
      <template v-for="(item) in tableHeadListSlotName" :slot="item.slotName" slot-scope="{row}">
        <div :key="item.slotName" v-if="row">
          <span>{{row.settlement_pay_method_display[item.slotName]}}</span>
        </div>
      </template>
    </nf-table-page>
    <p v-if="payType === 'inactive' || payType === 'invalid'" style="color:#FF5200">{{promptText}}</p>
    <nf-dialog
      title="打款"
      saveBtnText="打款"
      :dialog-visible.sync="remitDialog"
      v-if="remitDialog"
      width="600px"
      :click-sure-btn="clickSureBtn"
    >
      <div class="remit-content" slot="content">
        <div class="pay-details">
          <div>
            <h4>付款场景</h4>
            <p>{{remitDetails.bill_type_display}}</p>
          </div>
          <div>
            <h4>收款人姓名</h4>
            <p>{{remitDetails.receiver_name}}</p>
          </div>
          <div>
            <h4>收款人手机号</h4>
            <p>{{remitDetails.receiver_mobile}}</p>
          </div>
        </div>
        <div class="bank-details">
          <h4>{{remitDetails.settlement_pay_method_display.card_brand_display}}</h4>
          <div>
            <p>{{remitDetails.settlement_pay_method_display.card_number|formatCarNum}}</p>
            <div>
              <p>{{moneyCentToYuan(remitDetails.amount)|toThousandFilter}}元</p>
              <span>{{remitDetails.pay_state_display}}</span>
            </div>
          </div>
        </div>
        <!-- <div class="remit-prop">
          <p>卡号有误？</p>
          <router-link
            v-if="roles.settlement_account_edit"
            :to="`/settlementaccount/edit?id=${remitDetails.settlement_account}`"
          >修改结算人信息</router-link>
          <span v-else>请联系系统管理员进行修改</span>
        </div> -->
        <div class="sum-money">
          <h4>合计打款：</h4>
          <h1>{{moneyCentToYuan(remitDetails.amount)|toThousandFilter}}元</h1>
        </div>
      </div>
    </nf-dialog>
    <borrow
      v-if="receiptType==='dispatch_borrowing'&&receiptDialog"
      :receiptDialog.sync="receiptDialog"
      :content="receiptInfo"
    />
    <replenishment
      v-if="receiptType==='dispatch_supplement'&&receiptDialog"
      :receiptDialog.sync="receiptDialog"
      :content="receiptInfo"
    />
    <settlement
      v-if="receiptType==='dispatch_settlement'&&receiptDialog"
      :receiptDialog.sync="receiptDialog"
      :content="receiptInfo"
    />
  </div>
</template>

<script>
import borrow from "@/components/nf-views/nf-dialog-order/borrow";
import replenishment from "@/components/nf-views/nf-dialog-order/replenishment";
import settlement from "@/components/nf-views/nf-dialog-order/settlement";
export default {
  components: { borrow, replenishment, settlement },
  data() {
    return {
      storeModelName: "oilRemittanceModule",
      remitDialog: false,
      remitDetails: {},
      receiptDialog: false,
      receiptType: "dispatch_borrowing",
      receiptInfo: {},
      tableOperation: {
        width: 140,
        fixed: "right",
        buttonGroups: [
          scope => {
            return {
              name: "打款",
              isShow: scope.row.acl.can_pay && this.roles.oil_card_pay_records_pay,
              click: ({ row }) => {
                this.getReceiptInfo({ id: row.id });
              }
            };
          },
          // 根据字段判断按钮的显示状态
          scope => {
            return {
              name: "查看单据",
              isShow: scope.row,
              click: ({ row }) => {
                let id = row.bill;
                let apiUrl = "";
                this.receiptType = row.bill_type;
                switch (row.bill_type) {
                  case "dispatch_borrowing": //借支单
                    apiUrl = `${api.dispatchBillBorrowing}/${id}`;
                    break;
                  case "dispatch_supplement": //补款单
                    apiUrl = `${api.dispatchBillSupplement}/${id}`;
                    break;
                  case "dispatch_settlement": //结算单
                    apiUrl = `${api.dispatchBillSettlement}/${id}`;
                    break;
                }
                $get(apiUrl, {
                  id: id
                })
                  .then(res => {
                    this.receiptInfo = res;
                    this.receiptDialog = true;
                  })
                  .catch(() => {});
              }
            };
          }
        ]
      },
      payType: "ready",
      promptText:
        "还不能操作打款的单据可能是因为没有装车或审核未完成等原因，请知悉。"
    };
  },
  computed: {
    // 筛选出带slot插槽的数据
    tableHeadListSlotName() {
      return this.$store.state[this.storeModelName].tableHeadList.filter(
        item => item.slotName
      );
    },
    // 数据总数
    total() {
      return this.$store.state[this.storeModelName].total;
    },
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles;
    }
  },
  methods: {
    // 改变打款状态
    payTypeChange(tab) {
      switch (tab.name) {
        case "inactive":
          this.promptText =
            "还不能操作打款的单据可能是因为没有装车或审核未完成等原因，请知悉。";
          break;
        case "invalid":
          this.promptText =
            "无需打款的单据可能是因为调度单已被删除等原因，请知悉。";
          break;
      }
      this.receiptDialog = false;
      let params = this.$store.state[this.storeModelName].params;
      if (params.pay_state === tab.name) return;
      let excessParams = {
        pay_state: this.payType
      };
      this.$store.commit(`${this.storeModelName}/updateParams`, excessParams);
      this.$store.dispatch('pageData/getTableData', this.storeModelName)
    },
    // 打款
    clickSureBtn(loading) {
      loading(true);
      let apiUrl = `${api.remitMoney}/${this.remitDetails.id}/pay`;
      $post(apiUrl, {
        id: this.remitDetails.id,
        settlement_pay_method: this.remitDetails.settlement_pay_method
      })
        .then(() => {
          loading(false);
          this.$message.success("打款成功");
          this.remitDialog = false;
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
        })
        .catch(() => {
          loading(false);
        });
    },
    // 获取打款详情
    getReceiptInfo({ id }) {
      let apiUrl = `${api.remitMoney}/${id}`;
      $get(apiUrl, {
        id: id
      })
        .then(res => {
          this.remitDetails = res;
          this.remitDialog = true;
        })
        .catch(() => {});
    }
  },
  created() {
    this.payType = this.$store.state[this.storeModelName].params.pay_state
  }
};
</script>

<style lang="scss" scoped>
.client_name {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 20px;
}
.el-tabs /deep/ {
  .el-tabs__item {
    font-size: 24px;
    font-weight: 400;
  }
}
.remit-content {
  .pay-details {
    display: flex;
    border-bottom: 1px solid #f1f1f1;
    & > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &:nth-child(2) {
        position: relative;
        &::after,
        &::before {
          content: "";
          width: 1px;
          height: 30px;
          position: absolute;
          top: 50%;
          left: 0;
          margin-top: -15px;
          background: rgb(89, 166, 249);
        }
        &::after {
          left: auto;
          right: 0;
        }
      }
    }
    h4 {
      margin: 0;
    }
    p {
      height: 30px;
      line-height: 30px;
    }
  }
  .bank-details {
    margin-top: 15px;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0 5px 10px #ccc;
    h4 {
      margin: 5px 0;
    }
    p {
      font-size: 16px;
      font-weight: 500;
    }
    & > div {
      display: flex;
      justify-content: space-between;
      div {
        display: flex;
        align-items: center;
        p {
          font-size: 22px;
          color: rgb(63, 103, 197);
          margin: 0 50px;
        }
        span {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 5px;
          color: #fff;
          background: rgb(237, 112, 107);
        }
      }
    }
  }
  .remit-prop {
    margin-top: 20px;
    display: flex;
    align-items: center;
    a {
      color: #0099ff;
    }
    p {
      color: #999;
      margin-right: 10px;
    }
  }
  .sum-money {
    display: flex;
    align-items: flex-end;
    margin-top: 20px;
    h1,
    h4 {
      margin: 0;
    }
    h4 {
      padding-bottom: 4px;
      margin-right: 10px;
    }
    h1 {
      color: #0099ff;
    }
  }
}
</style>
