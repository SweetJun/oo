<template>
  <div class="department-page">
    <div class="tree-box" v-if="departmentRole['department_list']">
      <nf-tree
        ref="nfTree"
        :data="treeData"
        highlight-current
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExpandedKeys"
        @node-click="nodeClick">
      </nf-tree>
    </div>
    <!-- 表格 -->
    <nf-table-page
      v-if="showTable"
      :store-model-name="storeModelName"
      :selection="false"
      :table-operation="tableOperation">
      <div class="table-top-left" slot="top-btn-left">
        <div class="name-box">
          <span>{{currentDepartment.name}}（{{total}}人）</span>
          <el-checkbox v-model="containChild" @change="checkChanged">包含下级部门</el-checkbox>
        </div>
        <el-button size="medium" type="primary" @click="dialogMember = true" v-if="roles['department_user_add']"> 添加成员 </el-button>
        <el-button size="medium" type="primary" @click="handleAddDepartment" v-if="roles['department_add']"> 添加子部门 </el-button>
        <el-button size="medium" type="primary" @click="handleSetting" v-if="roles['department_edit']"> 设置 </el-button>
        <el-button size="medium" type="danger" icon="el-icon-delete" @click="handleDelete" v-if="roles['department_delete']"></el-button>
      </div>
    </nf-table-page>
    <!-- 添加子部门 -->
    <nf-dialog
      title="添加子部门"
      :dialog-visible.sync="dialogAddDepartment"
      width="400px"
      :click-sure-btn="addDepartmentSure">
      <div class="nf-dialog-content" slot="content">
        <el-form :model="formData" ref="ruleForm" label-position="top" :rules="formRules">
          <el-form-item label="部门名称：" prop="name">
            <el-input v-model="formData.name" placeholder="请输入部门名称"></el-input>
            <div class="type">
              类型： <el-checkbox v-model="formData.agency">办事处</el-checkbox>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </nf-dialog>
    <!-- 添加成员 -->
    <add-member
      v-if="dialogMember"
      :dialog-member.sync="dialogMember"
      :store-model-name="storeModelName">
    </add-member>
    <!-- 删除部门 -->
    <delete-department
      ref="deleteDepartment"
      :tree-data="treeData"
      :store-model-name="storeModelName"
      @getDepartments="getDepartments">
    </delete-department>
  </div>
</template>

<script>
import addMember from './components/addMemeber'
import deleteDepartment from './components/deleteDepartment'
import { toOneArray } from '@/utils/utils'
export default {
  components: {
    addMember,
    deleteDepartment
  },
  data() {
    return {
      storeModelName: 'departmentModule',
      privileges: [
        'department_list'
      ],
      departmentRole: {},
      treeData: [],
      showTable: false,
      defaultExpandedKeys: [],
      currentDepartment: {name: ''}, // 当前部门
      containChild: false,
      tableOperation: {
        width: 105,
        fixed: 'right',
        buttonGroups: [
          scope => {
            return {
              name: '移出部门',
              type: 'danger',
              isShow: scope.row.acl.can_delete,
              click: (scope) => {
                this.moveOut(scope.row);
              }
            }
          }
        ]
      },
      dialogMember: false,
      dialogAddDepartment: false,
      formData: {
        name: '',
        parent_id: '',
        agency: false
      },
      formRules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 数据总条数
    total() {
      return this.$store.state[this.storeModelName].total
    },
    roles() {
      return this.$store.state[this.storeModelName].roles
    }
  },
  methods: {
    // 获取部门树
    getDepartments() {
      $get(api.departments).then(res => {
        this.treeData = res
        if (this.treeData.length > 0) {
          this.$nextTick(async () => {
            if (this.d_id) {
              let newData = await toOneArray(this.treeData, 'child')
              let targetItem = newData.filter(item => {
                return item.id === this.d_id
              })
              this.currentDepartment = targetItem[0]
            } else {
              this.currentDepartment = this.treeData[0]
            }
            this.formData.parent_id = this.currentDepartment.id
            this.defaultExpandedKeys = [this.currentDepartment.id]
            this.$refs.nfTree.$refs.tree.setCurrentKey(this.currentDepartment.id)
            this.$store.commit(`${this.storeModelName}/updateDepartmentId`, this.currentDepartment.id)
            this.showTable = true
          })
        }
      })
    },
    // 是否包含下级
    checkChanged() {
      let obj = {includeChildren: this.containChild}
      this.$store.commit(`${this.storeModelName}/updateParams`, obj)
      this.$store.dispatch('pageData/getTableData', this.storeModelName)
    },
    // 点击菜单选择部门
    nodeClick(data) {
      this.currentDepartment = data
      this.formData.parent_id = data.id
      this.updatePathParams({ d_id: data.id, page: 1 })
      this.$store.commit(`${this.storeModelName}/updateParams`, { page: 1 })
      this.$store.commit(`${this.storeModelName}/updateDepartmentId`, data.id)
      this.$store.dispatch('pageData/getTableData', this.storeModelName)
    },
    // 点击添加子部门
    handleAddDepartment() {
      this.dialogAddDepartment = true
    },
    // 确认添加子部门
    addDepartmentSure(loading) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          loading(true)
          $post(api.department, this.formData).then((res) => {
            loading(false)
            this.dialogAddDepartment = false
            this.$message.success('添加成功')
            if (this.currentDepartment.child) {
              this.currentDepartment.child.push({
                id: res.departmentId,
                name: this.formData.name
              })
            } else {
              this.$set(this.currentDepartment, 'child', [])
              this.currentDepartment.child.push({
                id: res.departmentId,
                name: this.formData.name
              })
            }
          }).catch(() => {
            loading(false);
          })
        } else {
          return false;
        }
      })
    },
    // 点击集体设置
    handleSetting() {
      this.$router.push({
        path: '/department/setting',
        query: {id: this.currentDepartment.id}
      })
    },
    // 点击删除
    handleDelete() {
      this.$refs.deleteDepartment.departmentDeleteCheck()
    },
    // 移出部门
    moveOut(row) {
      this.confirm(`确认将 ${row.name} 从该部门移出？`).then(() => {
        $post(api.departmentUsersDelete, {
          department_id: this.currentDepartment.id,
          user_id: row.id
        }).then(() => {
          this.$store.dispatch('pageData/getTableData', this.storeModelName)
          this.$message.success('移出成功')
        })
      }).catch(() => {})
    },
    // 在原本url上添加参数
    updatePathParams(params) {
      let query = _.cloneDeep(this.$route.query) // _.cloneDeep 深拷贝（lodash.js）
      Object.assign(query, params)
      this.$router.replace({ query: query }).catch(() =>{})
    },
    // 权限检测
    getPrivileges() {
      this.checkPrivileges(this.privileges).then(res => {
        this.departmentRole = res ? res : {}
        if (this.departmentRole['department_list']) {
          this.getDepartments()
        }
      })
    }
  },
  created() {
    // 读取url页码等参数
    let urlPrams = this.$route.query
    if (urlPrams && urlPrams.d_id) {
      this.d_id = Number(urlPrams.d_id)
      this.updatePathParams({ d_id: urlPrams.d_id })
    }
    this.getPrivileges()
  }
}
</script>

<style lang="scss" scoped>
  .department-page{
    position: relative;
    /deep/ .nf-table{
      margin-left: 290px;
    }
  }
  .el-tree{
    width: 280px;
    max-width: 300px;
    overflow: auto;
    background-color: rgb(249, 250, 252);
    padding-bottom: 10px;
  }
  .tree-box{
    position: fixed;
    top: 100px;
    left: 230px;
    max-height: 700px;
    min-height: 222px;
    overflow: auto;
    box-shadow: 0 0px 10px 0 rgba(0, 0, 0, 0.1);
  }
  .el-button--danger{
    padding: 10px;
  }
  .name-box{
    margin-bottom: 15px;
    &>span{
      display: inline-block;
      margin-right: 20px;
    }
  }
  .el-form-item{
    .type{
      margin-top: 10px;
    }
  }
</style>
