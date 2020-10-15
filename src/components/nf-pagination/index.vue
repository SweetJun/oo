<template>
  <div class="nf-pagination">
    <el-pagination
      v-bind="$attrs"
      v-on="$listeners"
      v-if="defaultOptions.isPagination"
      background
      :total="total"
      :current-page.sync="defaultOptions.currentPage"
      :page-size.sync="defaultOptions.pageSize"
      :pageSizes="defaultOptions.pageSizes"
      :layout="defaultOptions.layout">
    </el-pagination>
  </div>

</template>

<script>
/**
* @Description: 分页组件
* @Author: wjw
* @Date: 2020-01-06 13:32:56
*/
export default {
  name: 'NfPagination',
  props: {
    total: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      defaultOptions: {
        isPagination: true,
        currentPage: 1,
        pageSize: 20,
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper'
      }
    }
  },
  watch: {
    $attrs: {
      handler(val, oldVal) {
        if (_.isEqual(val, oldVal)) return
        Object.assign(this.defaultOptions, val)
        this.defaultOptions.currentPage = Number(this.defaultOptions.currentPage)
        this.defaultOptions.pageSize = Number(this.defaultOptions.pageSize)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .nf-pagination{
    text-align: right;
    margin-top: 10px;
  }
  .el-pagination {
    &::after, &::before{
      display: initial;
      content: "";
    }
}
</style>
