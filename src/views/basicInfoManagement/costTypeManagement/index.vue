<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/costTypeManagement/add"
      :selection="false"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'costTypeManagementModule',
      tableOperation: {
        width: 155,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '编辑',
              type: 'primary',
              isShow: scope.row.acl.can_edit,
              click: ({row}) => {
                this.goNextPage('/costTypeManagement/edit', {id: row.id})
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
                  let apiUrl = `${api.expense}/${row.id}`
                  this.deleteTableRow(apiUrl, this.storeModelName, row)
                }
              }
            }
          },
          scope => {
            let row = scope.row;
            if (row) {
              return {
                name: '禁用',
                type: 'info',
                isShow: row.status === 'normal',
                click: ({
                  row
                }) => {
                  this.prohibitArea(row, 'disabled', '禁用');
                }
              }
            }
          },
          scope => {
            let row = scope.row;
            if (row) {
              return {
                name: '启用',
                type: 'success',
                isShow: row.status === 'disabled',
                click: ({
                  row
                }) => {
                  this.prohibitArea(row, 'normal', '启用');
                }
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    // 禁用 row
    prohibitArea(row, type, name) {
      let message = `确认${name}该费用？`
      if (name === '禁用') {
        message = message + '禁用后，新单据将无法再添加该费用。'
      }
      this.confirm(message).then(() => {
        let url = `${api.expense_disable}/${row.id}`
        $put(url, {
          status: type
        }).then(() => {
          this.$message.success('操作成功');
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
        })
      }).catch(() => {})
    }
  }
}

</script>
