<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/role/add"
      :selection="false"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'roleModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: "编辑",
              type: "primary",
              isShow: scope.row.acl.can_edit,
              click: ({row}) => {
                this.goNextPage('/role/edit', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: "删除",
              type: "danger",
              isShow: scope.row.acl.can_delete,
              click: ({row}) => {
                let apiUrl = `${api.role}/${row.id}`
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
