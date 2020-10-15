<template>
  <div>
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
      storeModelName: 'borrowingModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit && this.roles.dispatch_borrowing_edit,
              click: ({row})=> {
                this.goNextPage('/borrowing/edit', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: '删除',
              type: 'danger',
              isShow: scope.row.acl.can_delete && this.roles.dispatch_borrowing_delete,
              click: ({row})=> {
                let apiUrl = `${api.dispatchBill}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row)
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  }
}
</script>
