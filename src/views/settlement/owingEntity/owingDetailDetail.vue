<template>
  <div>
    <div class="top">
      <div class="float">
        <p>单据编号：{{entityInfo.cause_id_display}}</p>
        <p>生成时间：{{entityInfo.create_time_display}}</p>
      </div>
      <div class="float">
        <p>金额：{{moneyCentToYuan(entityInfo.owing_amount)}}元</p>
        <p>结余：{{moneyCentToYuan(entityInfo.rest_owing_amount)}}元</p>
      </div>
      <div class="float">
        <p>状态：{{entityInfo.status}}</p>
      </div>
    </div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :show-edit-table-header="false"
      :isPagination="false"
      :table-operation="tableOperation">
      <div slot="top-btn-left">
        <el-button type="primary" size="small" @click="back">返回</el-button>
      </div>
      <template v-for="(item) in tableHeadListSlotName" :slot="item.slotName" slot-scope="{row}">
        <div :key="item.slotName" v-if="item.slotName === 'amount_repaid'">
          <span :class="[Number(row[item.slotName])>0 ? 'active' : 'inActive' ]">{{row[item.slotName]}}</span>
        </div>
      </template>
    </nf-table-page>
    <!-- 单据 -->
    <borrow
      v-if="receiptDialog_borrowing"
      :receiptDialog.sync="receiptDialog_borrowing"
      :content="receiptInfo"
    />
    <settlement
      v-if="receiptDialog_settlement"
      :receiptDialog.sync="receiptDialog_settlement"
      :content="receiptInfo"
    />
    <nf-dialog
      title="查看详情"
      v-if="dialogVisible"
      :dialog-visible.sync="dialogVisible"
      width="700px">
      <div class="nf-dialog-content" slot="content">
        <el-row>
          <el-col :span="12">单据编号：{{dialogInfo.cause_id_display}}</el-col>
          <el-col :span="12">生成时间：{{dialogInfo.create_time_display}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12">金额：{{moneyCentToYuan(dialogInfo.owing_amount)}}元</el-col>
          <el-col :span="12">结余：{{moneyCentToYuan(dialogInfo.rest_owing_amount)}}元</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">状态：{{dialogInfo.status}}</el-col>
        </el-row>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
import borrow from "@/components/nf-views/nf-dialog-order/borrow";
import settlement from "@/components/nf-views/nf-dialog-order/settlement";
export default {
  components: { borrow, settlement },
  data() {
    return {
      storeModelName: 'owingDetailDetailModule',
      dialogVisible: false,
      receiptDialog_borrowing: false,
      receiptDialog_settlement: false,
      dialogInfo: {},
      receiptInfo: {},
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '单据详情',
              isShow: scope.row,
              click: ({row})=> {
                let id = row.repaid_to
                if(row.repaid_to_type === 'dispatch_bill') {
                  if(row.detail.dispatch_bill_type === 'dispatch_borrowing') {
                    let apiUrl = `${api.dispatchBillBorrowing}/${id}`;
                    $get(apiUrl, {
                      id: id
                    })
                      .then(res => {
                        this.receiptInfo = res
                        this.receiptDialog_borrowing = true
                      })
                  }else if(row.detail.dispatch_bill_type === 'dispatch_settlement') {
                    let apiUrl = `${api.dispatchBillSettlement}/${id}`;
                    $get(apiUrl, {
                      id: id
                    })
                      .then(res => {
                        this.receiptInfo = res
                        this.receiptDialog_settlement = true
                      })
                      .catch(() => {});
                  }
                }else if(row.repaid_to_type === 'owing_record') {
                  $get(`${api.owingRecord}/${id}`, {})
                    .then(res => {
                      res.status = res.rest_owing_amount !== 0 ? '未结清' : '已结清'
                      this.dialogInfo = res
                      this.dialogVisible = true
                    })
                }
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    // 筛选出带slot插槽的数据
    tableHeadListSlotName() {
      return this.$store.state[this.storeModelName].tableHeadList.filter(
        item => item.slotName
      );
    },
    // 基本信息
    entityInfo() {
      let entityInfo = this.$store.state[this.storeModelName].entityInfo
      return entityInfo
    }
  },
  created() {
    // 10
    this.$store.commit(`${this.storeModelName}/updateId`, this.$route.query.id)
    this.$store.dispatch(`${this.storeModelName}/getInfo`)
  },
  methods: {
    // 返回
    back() {
      this.$router.back()
    },
    // 详情
    lookDetail(row) {
      this.$router.push({
        path: '/settlement/owingEntity/detail',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .active{
    color: red;
  }
  .inActive{
    color: green;
  }
  .top{
    width:100%;
    height:100px;
    background:white;
    margin-bottom:20px;
    border-radius:4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 0 20px;
  }
  .float{
    float: left;
    margin-right: 200px;
    font-size: 18px;
    font-weight: bold;
    span{
      font-size: 24px;
    }
  }
  .el-row{
    margin-bottom: 20px;
    font-size: 16px;
  }
</style>
