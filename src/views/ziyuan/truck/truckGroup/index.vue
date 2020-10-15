<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      add-btn-link="/truck/truckgroup/add"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'truckGroupModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit,
              click: ({row})=> {
                this.goNextPage('/truck/truckgroup/edit', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: '删除',
              type: 'danger',
              isShow: scope.row.acl.can_delete,
              click: ({row})=> {
                let apiUrl = `${api.truckGroup}/${row.id}`
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

<style lang="scss" scoped>
  .el-form-item{
    .el-select{
      width: 100%;
    }
  }
</style>
