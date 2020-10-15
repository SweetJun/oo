<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      :store-model-name="storeModelName"
      :selection="false"
      add-btn-link="/driver/driverGrouping/add"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'driverGroupingModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit,
              click: ({row})=> {
                this.goNextPage('/driver/driverGrouping/edit', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: '删除',
              type: 'danger',
              isShow: scope.row.acl.can_delete,
              click: ({row})=> {
                let apiUrl = `${api.driverGroup}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row)
              }
            }
          }
        ]
      }
    }
  }
}
</script>
