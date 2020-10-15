/*
 * @Description: 全局mixin
 * @Author: wjw
 * @Date: 2020-05-13 15:38:55
 */
import { updateParams } from '@/utils/utils'
const mixin = {
  methods: {
    /**
     * @Description: 新建、编辑等跳转
     * @param : { path } 路由
     * @param : { query } 参数对象  如{id: 1}
     */
    goNextPage(path = '/', query = {}) {
      let hasQuery = _.isObject(query) && !(_.isEmpty(query))
      if (hasQuery) {
        this.$router.push({
          path: path,
          query: query
        })
      } else {
        this.$router.push(path)
      }
    },
    /**
     * @Description: 列表页的共用删除方法
     * 处理了可选择列表多选及删除的问题
     * 处理了列表删除最后一页数据后，分页显示不正常的问题，
     * @param { String } apiUrl 删除接口地址
     * @param { String } storeModelName 当前storeModelName
     * @param { Object } row 删除的列
     * @param { Boolean } selectable 列表是否可选择，当true时，row必传
     * @param { String } ref 引用 'nf-table-page' 组件时设置的ref值
     */

    deleteTableRow(apiUrl, storeModelName, row, selectable = false, ref = 'nfTable') {
      this.confirm('确认删除该条数据？').then(() => {
        $delete(apiUrl).then(() => {
          this.$message.success('删除成功')

          let total = this.$store.state[storeModelName].total // 总条数
          let params = this.$store.state[storeModelName].params // 请求数据的分页参数
          let pages = Math.ceil((total - 1) / params.per_page) // 删除后，数据总页数
          let currentPage = Number(params.page) > pages ? pages : Number(params.page) // 如果当前页完全删除，跳转到上一页
          currentPage = currentPage < 1 ? 1 : currentPage

          if (Number(currentPage) !== Number(params.page)) {
            updateParams(this, { page: currentPage })
            this.$store.commit(`${storeModelName}/updateParams`, { page: currentPage })
          }

          if (selectable) {
            this.$refs[ref].$refs['nf-el-table'].toggleRowSelection(row, false)
            this.$store.dispatch('pageData/getTableData', this.storeModelName)
            let multipleSelection = this.$store.state[storeModelName].multipleSelection
            this.$store.commit(`${storeModelName}/updateSelection`, _.pull(multipleSelection, row.id))
          } else {
            this.$store.dispatch('pageData/getTableData', this.storeModelName)
          }
        })
      }).catch(() => {})
    }
  }
}

export default mixin
