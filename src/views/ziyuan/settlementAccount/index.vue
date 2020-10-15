<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/settlementaccount/add"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'settlementAccountModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit,
              click: ({row})=> {
                this.goNextPage('/settlementaccount/edit', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: '删除',
              type: 'danger',
              isShow: scope.row.acl.can_delete,
              click: ({row})=> {
                let apiUrl = `${api.settlementAccount}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row, true)
              }
            }
          }
        ]
      },
      batchOptions: [
        {
          id: 0,
          role: 'settlement_account_delete',
          label: '批量删除',
          url: api.settlementAccountBatchDel
        }
      ]
    }
  }
}
</script>
