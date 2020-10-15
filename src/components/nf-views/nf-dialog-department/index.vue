<template>
  <!-- 选择部门 -->
    <nf-dialog
      title="选择部门"
      :dialog-visible.sync="dialogDepartment"
      width="800px"
      :appendToBody="appendToBody"
      :disabled="!(selectData.length) > 0 && !multiple"
      :close-dialog="closeDialog"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content flex" slot="content">
        <div class="left">
          <span class="span-title">请选择部门</span>
          <nf-tree
            ref="nfTree"
            v-loading="loading"
            :data="treeData"
            highlight-current
            :expand-on-click-node="false"
            :default-expanded-keys="defaultExpandedKeys"
            @node-click="nodeSelectClick">
          </nf-tree>
        </div>
        <div class="right">
          <span class="span-title">已选择的部门</span>
          <div class="departments">
            <!-- <el-tag v-if="selectData.name" closable @close="handleClose">{{selectData.name}}</el-tag> -->
            <el-tag
              v-for="(item, index) in selectData"
              :key="index"
              closable
              @close="handleClose(index)">
              {{item.name}}
            </el-tag>
          </div>
        </div>
      </div>
    </nf-dialog>
</template>

<script>
export default {
  name: 'nfDialogDepartment',
  props: {
    dialogDepartment: {
      type: Boolean,
      default: false
    },
    defaultDepartment: {
      type: [Array, Object],
      default: () => {
        return {
          id: '',
          name: ''
        }
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      treeData: [],
      selectData: [],
      defaultExpandedKeys: []
    }
  },
  methods: {
    // 获取部门树数据
    getDepartmentTree() {
      this.loading = true
      $get(api.departments).then(res => {
        this.treeData = res
        this.loading = false
        if (res.length > 0) {
          this.$nextTick(() => {
            if (this.defaultDepartment.id || (_.isArray(this.defaultDepartment) && this.defaultDepartment.length > 0)) {

              this.selectData = this.multiple ? this.defaultDepartment : [this.defaultDepartment]

              this.defaultExpandedKeys = _.map(this.selectData, 'id')
              if (!this.multiple) {
                this.$refs.nfTree.$refs.tree.setCurrentKey(this.defaultDepartment.id)
              }
            }
          })
        }
      })
    },
    // 点击菜单选择部门
    nodeSelectClick(data) {
      if (this.multiple) {
        this.selectData.push(data)
        this.selectData = _.uniqBy(this.selectData, 'id')
      } else {
        this.selectData = [data]
      }
    },
    // 删除部门
    handleClose(index) {
      this.selectData.splice(index, 1)
    },
    // 关闭弹框回调（嵌套有用）
    closeDialog() {
      this.dialogDepartment = false
      this.$emit('update:dialogDepartment', false)
    },
    // 选择部门确认
    clickSureBtn() {
      this.closeDialog()
      if (this.multiple) {
        this.$emit('selectData', this.selectData)
      } else {
        this.$emit('selectData', this.selectData[0])
      }
    }
  },
  mounted() {
    this.getDepartmentTree()
  }
}
</script>
<style lang="scss" scoped>
  .nf-dialog-content{
    .left{
      height: auto;
    }
  }
  .el-tag{
    margin-right: 20px;
    margin-bottom: 15px;
  }
</style>
