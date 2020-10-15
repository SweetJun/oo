<template>
  <div>
    <!-- 表格 -->
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
      storeModelName: 'orderToReplyModule',
      tableOperation: {
        width: 80,
        fixed: 'right',
        buttonGroups: [
          () => {
            return {
              name: '回单',
              isShow: this.roles['order_reply'],
              click: ({row})=> {
                this.goNextPage('/orderToReply/receipt', {id: row.id})
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    // 权限
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    // 点击回单
    receiptOrder(row) {
      this.$router.push({
        path: '/orderToReply/receipt',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table--border/deep/{
    td:first-child .cell{
      padding-left: 14px;
    }
  }
  .block{
    margin-top: 20px;
  }
  .el-textarea{
    width: 60%;
  }
</style>
