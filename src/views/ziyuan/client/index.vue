<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/client/add"
      :selection="false"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'clientModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              type: 'primary',
              isShow: scope.row.acl.can_edit,
              click: ({row}) => {
                this.goNextPage('/client/edit', {id: row.id})
              }
            }
          },
          // 根据字段判断按钮的显示状态
          scope => {
            let row = scope.row;
            if (row) {
              return {
                name: '删除',
                type: 'danger',
                isShow: scope.row.acl.can_delete,
                click: ({row})=> {
                  let apiUrl = `${api.client}/${row.id}`
                  this.deleteTableRow(apiUrl, this.storeModelName, row)
                }
              }
            }
          }
        ]
      }
    }
  }
}
</script>
