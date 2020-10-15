<template>
  <div class="delete-department">
    <!--  -->
    <nf-dialog
      title="删除部门确认"
      :dialog-visible.sync="dialogDelete"
      width="600px"
      :click-sure-btn="deleteSureBtn">
      <div class="nf-dialog-content" slot="content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning"></div>
          <div class="el-message-box__message">
            <p>此部门有运单调度单数据</p>
          </div>
        </div>
        <div class="message-detail">
          <span>{{errorMessage}}</span>
        </div>
      </div>
    </nf-dialog>
    <!-- 选择部门 -->
    <nf-dialog
      title="选择部门"
      :dialog-visible.sync="dialogDepartment"
      width="800px"
      :disabled="!selectData.id"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content flex" slot="content">
        <div class="left">
          <span class="span-title">请选择部门</span>
          <nf-tree
            ref="nfTree"
            :data="treeData"
            highlight-current
            :expand-on-click-node="false"
            @node-click="nodeSelectClick">
          </nf-tree>
        </div>
        <div class="right">
          <span class="span-title">已选择的部门</span>
          <div class="departments">
            <el-tag v-if="selectData.name" closable @close="handleClose">{{selectData.name}}</el-tag>
          </div>
        </div>
      </div>
    </nf-dialog>
  </div>
</template>
<script>
export default {
  props: {
    // store模块 名称
    storeModelName: {
      type: String,
      default: ''
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 部门id
    departmentId() {
      return this.$store.state[this.storeModelName].departmentId
    }
  },
  data() {
    return {
      dialogDelete: false,
      dialogDepartment: false,
      errorMessage: '',
      selectData: {id: '', name: ''}
    }
  },
  methods: {
    // 验证删除部门
    departmentDeleteCheck() {
      let url = `${api.departmentDeleteCheck}/${this.departmentId}`
      $get(url).then(res => {
        if (res.data.length === 0) {
          this.confirm('确定删除此部门吗？', '删除部门确认').then(() => {
            this.deleteDepartment()
          }).catch(() => {})
        } else {
          this.errorMessage = '这个message是要后台返回的'
          this.dialogDelete = true
        }
      })
    },
    // 执行删除
    deleteDepartment() {
      $delete(`${api.department}/${this.departmentId}`, {mount_to_id: this.mount_to_id}).then(() => {
        this.$message.success('删除成功')
        this.$emit('getDepartments')
        let query = _.cloneDeep(this.$route.query)
        delete query.d_id
        this.$router.replace({ query: query }).catch(() =>{})
      })
    },
    // 确认删除
    deleteSureBtn() {
      this.deleteDepartment()
    },
    // 点击选择部门
    handleDepartment() {
      this.dialogDepartment = true
    },
    // 点击菜单选择部门
    nodeClick(data) {
      this.selectData = data
    },
    // 删除部门
    handleClose() {
      this.selectData = {
        id: '',
        name: ''
      }
    },
    // 选择部门确认
    clickSureBtn() {
      this.mount_to_id = this.selectData.id
      this.dialogDepartment = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-message-box__message{
    p{
      color: #303030;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .message-detail{
    margin-top: 10px;
    padding-left: 36px;
    span{
      display: inline-block;
      line-height: 1.8;
    }
  }
</style>
