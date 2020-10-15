<template>
  <div>
    <!-- 表格 -->
    <nf-table-page
      ref="nfTable"
      :store-model-name="storeModelName"
      :selection="false"
      add-btn-link="/custom/chartmanagement/add"
      :table-operation="tableOperation">
    </nf-table-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeModelName: 'customChartManagementModule',
      tableOperation: {
        width: 118,
        fixed: 'right',
        buttonGroups: [
          () => {
            return {
              name: '编辑',
              isShow: this.roles['custom_chart_edit'],
              click: ({row})=> {
                this.goNextPage('/custom/chartmanagement/edit', {id: row.id})
              }
            }
          },
          () => {
            return {
              name: '删除',
              type: 'danger',
              isShow: this.roles['custom_chart_delete'],
              click: ({row})=> {
                let apiUrl = `${api.customChart}/${row.id}`
                this.deleteTableRow(apiUrl, this.storeModelName)
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
