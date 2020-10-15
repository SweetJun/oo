<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      add-btn-link="/oilCard/add"
      :batch-options="batchOptions"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'oilCardModule',
      tableOperation: {
        width: 155,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '损坏',
              type: 'warning',
              isShow: scope.row.acl.can_damage,
              click: ({row})=> {
                this.damageFun(row)
              }
            }
          },
          scope => {
            return {
              name: '编辑',
              isShow: scope.row.acl.can_edit,
              click: ({row})=> {
                this.goNextPage('/oilCard/edit', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: '删除',
              type: 'danger',
              isShow: scope.row.acl.can_delete,
              click: ({row})=> {
                let apiUrl = `${api.oilCard}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName, row, true)
              }
            }
          }
        ]
      },
      batchOptions: [
        {
          id: 0,
          role: 'oil_card_delete',
          label: '批量删除',
          url: api.oilCardBatchDelete
        }
      ]
    }
  },
  methods: {
    // 损坏
    damageFun(row) {
      this.confirm('油卡损坏后将无法使用，确定已损坏？').then(() => {
        $post(`${api.oilCardDamage}/${row.id}`).then(() => {
          this.$message.success('操作成功')
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
        }).catch(() => {})
      })
    }
  }
}
</script>
