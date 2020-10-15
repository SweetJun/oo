<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'dispatchToAddSettlementBillModule',
      tableOperation: {
        width: 105,
        fixed: 'right',
        buttonGroups: [
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
          }
        ]
      }
    }
  }
}
</script>
