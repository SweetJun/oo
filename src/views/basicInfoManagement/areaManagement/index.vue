<template>
  <div class="page-container">
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/areaManagement/add"
      :table-operation="tableOperation"
      :batch-options="batchOptions">
    </nf-table-page>
    <p class="notice">系统默认地区不允许修改或删除</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'areaManagementModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit,
              click: ({row})=> {
                this.goNextPage('/areaManagement/edit', {id: row.id})
              }
            }
          },
          scope => {
            let row = scope.row;
            if (row) {
              return {
                name: '删除',
                type: 'danger',
                isShow: scope.row.acl.can_delete,
                click: ({row}) => {
                  let apiUrl = `${api.region}/${row.id}`
                  this.deleteTableRow(apiUrl, this.storeModelName, row, true)
                }
              }
            }
          }
        ]
      },
      batchOptions: [
        {
          id: 0,
          label: '批量删除',
          role: 'region_delete',
          url: api.regionBatchDelete
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container{
  position: relative;
}
.notice{
  color: #f56c6c;
  position: absolute;
  bottom: 20px;
  left: 10px;
  margin: 0;
}
</style>
