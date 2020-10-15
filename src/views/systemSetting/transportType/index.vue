<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      :store-model-name="storeModelName"
      :selection="false"
      add-btn-link="/transporttype/add"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'transportTypeModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '设置',
              isShow: scope.row.acl.can_edit,
              click: ({row}) => {
                this.goNextPage('/transporttype/edit', {id: row.id})
              }
            }
          },
          scope => {
            return {
              name: '禁用',
              type: 'info',
              isShow: scope.row.acl.can_change_status && scope.row.status === 'normal',
              click: (scope) => {
                this.prohibit(scope.row);
              }
            }
          },
          scope => {
            return {
              name: '启用',
              type: 'success',
              isShow: scope.row.acl.can_change_status && scope.row.status === 'disabled',
              click: (scope) => {
                this.enable(scope.row);
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    // 禁用
    prohibit(row) {
      this.confirm('确认禁用该承运类型？').then(() => {
        $post(api.transportTypeStatus, {
          id: row.id,
          status: 'disabled'
        }).then(() => {
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
          this.$message.success('禁用成功')
        })
      }).catch(() => {})
    },
    // 启用
    enable(row) {
      this.confirm('确认启用该承运类型？').then(() => {
        $post(api.transportTypeStatus, {
          id: row.id,
          status: 'normal'
        }).then(() => {
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
          this.$message.success('启用成功')
        })
      }).catch(() => {})
    }
  }
}
</script>
