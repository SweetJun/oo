<template>
  <div>
    <!-- 添加成员 -->
    <nf-dialog
      title="可查看的数据类型"
      :dialog-visible.sync="dialogDetail"
      width="1000px"
      @close="dialogClose"
      :click-sure-btn="dialogClose">
      <div class="nf-dialog-content" slot="content">
        <el-table
          :data="tableData"
          max-height="460px"
          border
          v-loading="loading"
          size="mini">
          <el-table-column prop="value" label="数据类型" min-width="100"></el-table-column>
          <el-table-column prop="department_display" label="可查看部门" show-overflow-tooltip min-width="120"></el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.acl.can_edit"
                size="mini"
                type="text"
                @click="handleEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </nf-dialog>
    <!-- 选择部门 -->
    <nf-dialog-department
      v-if="dialogDepartment"
      :multiple="true"
      :default-department="defaultDepartment"
      :dialog-department.sync="dialogDepartment"
      ref="nfDialogDepartment"
      @selectData="getSelectData"/>
  </div>
</template>
<script>
// 可查看的数据类型
export default {
  props: {
    dialogDetail: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      dialogDepartment: false,
      defaultDepartment: [],
      type: '',
      tableData: []
    }
  },
  methods: {
    // 获取成员
    getRoles() {
      this.loading = true
      let url = `${api.userDataPrivilege}/${this.currentId}`
      $get(url).then(res => {
        this.tableData = res
        this.loading = false
      })
    },
    // 点击修改部门
    handleEdit(row) {
      this.dialogDepartment = true
      this.type = row.key
      this.defaultDepartment = row.department_list
    },
    // 确认修改部门
    getSelectData(data) {
      let url = `${api.userDataPrivilege}/${this.currentId}/type/${this.type}`
      let department_ids = []
      if (data.length!== 0) {
        department_ids = _.map(data, 'id')
      }
      let params = {
        department_ids: department_ids
      }
      $put(url, params).then(() => {
        this.$message.success('修改成功')
        this.getRoles()
      })
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogDetail = false
      this.$emit('update:dialogDetail', false)
    }
  },
  watch: {
    dialogDetail(val) {
      if (!val) return
      this.tableData = []
      this.getRoles()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tooltip__popper{
    width: 200px;
  }
</style>
