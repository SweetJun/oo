<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/dispatch/add"
      add-btn-link-text="新建调度单"
      :selection="false"
      :table-operation="tableOperation"
      :show-dropdown-groups="true">
      <template v-for="item in tableHeadListSlotName" :slot="item.slotName" slot-scope="{row}">
        <div class="link-box" :key="item.slotName" v-if="row">
          <span v-if="Array.isArray(row[item.slotName]) && row[item.slotName].length === 0"> - </span>
          <template v-else v-for="(bill, index) in row[item.slotName]">
            <span
              v-if="roleForBills(item.slotName)"
              :key="index"
              @click.stop="billClick(bill, item.slotName)">
              <span class="td-click-span">{{bill.bill_number}}</span>
              <span>{{ index === row[item.slotName].length - 1 ? '' : '，'}}</span>
            </span>
            <span v-else :key="index">
              {{bill.bill_number}}{{ index === row[item.slotName].length - 1 ? '' : '，'}}
            </span>
          </template>

        </div>
      </template>
    </nf-table-page>
    <borrow
      v-if="receiptDialog_borrowing"
      :receiptDialog.sync="receiptDialog_borrowing"
      :content="receiptInfo"/>
    <replenishment
      v-if="receiptDialog_supplement"
      :receiptDialog.sync="receiptDialog_supplement"
      :content="receiptInfo"/>
    <settlement
      v-if="receiptDialog_settlement"
      :receiptDialog.sync="receiptDialog_settlement"
      :content="receiptInfo"/>
    <nf-dialog
      title="装车清单"
      :dialog-visible.sync="dialogVisible"
      width="700px"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <div class="header">
          运输动态：
          <span v-for="(item, index) in internalPoints" :key="index">
            {{item}} <span v-if="index < internalPoints.length - 1"> - </span>
          </span>
        </div>
        <div class="list">
          <p class="title">装车清单</p>
          <div class="item no-data" v-if="vehicleslList.length === 0">暂无数据</div>
          <div class="item" v-for="(vehicle, index) in vehicleslList" :key="index">
            <div class="info">
              <div class="top">
                <div class="flex-item">
                  <p class="title">出发地：</p>
                  <p class="value">{{vehicle.order_vehicle_display.from_display}}</p>
                </div>
                <div class="flex-item">
                  <p class="title">目的地：</p>
                  <p class="value">{{vehicle.order_vehicle_display.to_display}}</p>
                </div>
                <div class="flex-item">
                  <p class="title">车型：</p>
                  <p class="value">{{vehicle.order_vehicle_display.vehicle_display}}</p>
                </div>
              </div>
              <el-checkbox v-model="vehicle.transfer" :disabled="!vehicle.transfer_changeable">中转</el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
import borrow from "@/components/nf-views/nf-dialog-order/borrow";
import replenishment from "@/components/nf-views/nf-dialog-order/replenishment";
import settlement from "@/components/nf-views/nf-dialog-order/settlement";
export default {
  components: {
    borrow,
    replenishment,
    settlement
  },
  data() {
    return {
      storeModelName: 'dispatchModule',
      receiptDialog_borrowing: false,
      receiptDialog_supplement: false,
      receiptDialog_settlement: false,
      receiptInfo: {},
      tableOperation: {
        width: 132,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit && this.roles.dispatch_edit,
              click: ({row})=> {
                this.goNextPage('/dispatch/edit', {id: row.id})
              }
            }
          }
        ],
        dropdownGroups: [
          scope => {
            return {
              name: '申请借支',
              isShow: scope.row.acl.can_add_borrowing_bill && this.roles.dispatch_borrowing_add,
              click: ({row})=> {
                this.goNextPage('/borrowing/add', {
                  dispatch_id: row.id,
                  dispatch_name: row.number
                })
              }
            }
          },
          scope => {
            return {
              name: '申请补款',
              isShow: scope.row.acl.can_add_supplement_bill && this.roles.dispatch_supplement_add,
              click: ({row})=> {
                this.goNextPage('/supplement/add', {
                  dispatch_id: row.id,
                  dispatch_name: row.number
                })
              }
            }
          },
          scope => {
            return {
              name: '申请结算',
              isShow: scope.row.acl.can_add_settlement_bill,
              click: ({row})=> {
                this.goNextPage('/settlement/add', {
                  dispatch_id: row.id,
                  dispatch_name: row.number
                })
              }
            }
          },
          () => {
            return {
              name: '装车清单',
              isShow: this.roles.dispatch_vehicle_loading_list,
              click: ({row})=> {
                this.loadingList(row)
              }
            }
          },
          scope => {
            return {
              name: '删除',
              isShow: scope.row.acl.can_delete && this.roles.dispatch_delete,
              click: ({row})=> {
                let apiUrl = `${api.dispatch}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row)
              }
            }
          }
        ]
      },
      internalPoints: [],
      vehicleslList: [],
      dialogVisible: false
    }
  },
  computed: {
    // 筛选出带slot插槽的数据
    tableHeadListSlotName() {
      return this.$store.state[this.storeModelName].tableHeadList.filter(
        item => item.slotName
      )
    },
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    roleForBills(slotName) {
      if (
        (slotName === 'borrowing_bills' && this.roles['dispatch_borrowing_detail']) ||
        (slotName === 'supplement_bills' && this.roles['dispatch_supplement_detail']) ||
        (slotName === 'settlement_bills' && this.roles['dispatch_settlement_detail'])
      ) {
        return true
      }
      return false
    },
    // bill link
    billClick(bill, billType) {
      let id = bill.bill_id, apiUrl = '';
      switch(billType) {
        case 'borrowing_bills':
          apiUrl = `${api.dispatchBillBorrowing}/${id}`;
          $get(apiUrl, { id: id }).then(res => {
            this.receiptInfo = res
            this.receiptDialog_borrowing = true
          })
          break
        case 'supplement_bills':
          apiUrl = `${api.dispatchBillSupplement}/${id}`;
          $get(apiUrl, { id: id }).then(res => {
            this.receiptInfo = res
            this.receiptDialog_supplement = true
          })
          break
        case 'settlement_bills':
          apiUrl = `${api.dispatchBillSettlement}/${id}`;
          $get(apiUrl, { id: id }).then(res => {
            this.receiptInfo = res
            this.receiptDialog_settlement = true
          })
          break
      }
    },
    loadingList(row) {
      this.currentId = row.id
      let apiUrl = `${api.dispatch}/${row.id}/vehicles/to/change/transfer`
      $get(apiUrl).then(res => {
        this.dialogVisible = true
        this.internalPoints = res.internal_points
        this.vehicleslList = res.vehicles
      })
    },
    clickSureBtn(loading) {
      let apiUrl = `${api.dispatch}/${this.currentId}/change/vehicles/transfer`
      let ids = {}
      _.forEach(this.vehicleslList, item => {
        ids[item.order_vehicle] = item.transfer
      })
      loading(true)
      $post(apiUrl, { transfer_set: ids }).then(() => {
        loading(false)
        this.dialogVisible = false
        this.$message.success('操作成功')
      }).catch(() => {
        loading(false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.link-box{
  white-space: break-spaces;
}
.list{
  max-height: 400px;
  overflow: auto;
  .title{
    color: #999;
  }
  .item{
    padding: 10px 20px;
    border-bottom: 1px solid #f2f2f2;
    &.no-data{
      padding: 20px 0;
      text-align: center;
    }
    &:first-of-type{
      border-top: 1px solid #f2f2f2;
    }
  }
}
.top{
  display: flex;
  justify-content: space-between;
  .flex-item{
    .title{
      color: #999;
      margin: 0;
    }
    .value{
      font-size: 16px;
    }
  }
}
</style>
