<template>
  <div>
    <!-- 添加成员 -->
    <nf-dialog
      class="nf-dialog"
      title="设置角色"
      :dialog-visible.sync="dialogRole"
      width="1000px"
      :disabled="selectRoles.length === 0"
      @close="dialogClose"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content flex" slot="content">
        <div class="left">
          <span class="span-title">请选择角色</span>
          <el-input
            placeholder="搜索角色"
            clearable
            size="medium"
            prefix-icon="el-icon-search"
            @input="inputChange"
            v-model="keyWorld">
          </el-input>
          <nf-infinite-scroll
            target=".el-table__body-wrapper"
            :infinite-scroll="scrollToBottom">
            <template slot="content">
              <el-table
                ref="roleTable"
                class="roleTable"
                :data="roleData"
                max-height="460px"
                border
                size="mini"
                row-key="id"
                v-loading="loading"
                @select="handleSelectionChange"
                :show-header="false">
                <el-table-column prop="name" label="姓名" min-width="100"></el-table-column>
                <el-table-column prop="description" label="角色描述" min-width="120"></el-table-column>
                <el-table-column type="selection" reserve-selection width="45"/>
                <div slot="append" class="append-last-row" v-if="!loading">
                  {{loadingTxt}}
                </div>
              </el-table>
            </template>
          </nf-infinite-scroll>
        </div>
        <div class="right">
          <span class="span-title">已选择的角色</span>
          <div class="departments">
            <el-tag
              v-for="(item, index) in selectRoles"
              :key="index"
              closable
              @close="handleClose(index)">
              {{item.name}}
            </el-tag>
          </div>
        </div>
      </div>
    </nf-dialog>
  </div>
</template>
<script>
// 选择角色组件
import { debounce } from 'throttle-debounce'
export default {
  props: {
    // store模块 名称
    storeModelName: {
      type: String,
      default: ''
    },
    dialogRole: {
      type: Boolean,
      default: false
    },
    selectRoles: {
      type: Array,
      default: () => []
    },
    currentId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      loadingTxt: '',
      keyWorld: '',
      params: {
        page: 1,
        per_page: 20
      },
      roleData: []
    }
  },
  methods: {
    // 获取成员
    getRoles() {
      this.loading = true
      let params = {
        pager: {
          page: 1,
          per_page: 10
        },
        condition: {
          role_name_text: {
            key: '',
            value: this.keyWorld
          }
        },
        is_brief: true
      }
      $get(api.roles, params).then(res => {
        if (res.data.length === 20) {
          this.canLoad = true
          this.loadingTxt = ''
        } else {
          this.canLoad = false
          this.loadingTxt = '已加载全部角色'
        }
        this.roleData = this.roleData.concat(res.data)
        this.loading = false
        this.$nextTick(() => {
          this.selectRoles.forEach(checkItem => {
            this.roleData.forEach(dataItem => {
              if (checkItem.id === dataItem.id) {
                this.$refs['roleTable'].toggleRowSelection(dataItem, true)
                return
              }
            })
          })
        })
      })
    },
    inputChange() {
      this.params.page = 1
      this.debounceSearch()
    },
    searchMemeber() {
      this.roleData = []
      this.getRoles()
    },
    // 选择角色
    handleSelectionChange(val) {
      this.selectRoles = val
    },
    // 删除角色
    handleClose(index) {
      let _index = _.findIndex(this.roleData, { id: this.selectRoles[index].id })
      this.$refs['roleTable'].toggleRowSelection(this.roleData[_index], false)
      this.selectRoles.splice(index, 1)
    },
    // 确认添加人员
    clickSureBtn(loading) {
      loading(true)
      let apiUrl = `${api.user}/${this.currentId}`
      let params = {
        department_ids: [],
        role_ids: _.map(this.selectRoles, 'id')
      }
      $put(apiUrl, params).then(() =>{
        loading(false)
        this.dialogClose()
        this.$message.success('设置成功')
        this.$store.dispatch('pageData/getTableData', this.storeModelName)
      }).catch(() => {
        loading(false)
      })
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogRole = false
      this.$emit('update:dialogRole', false)
    },
    // 滚动到底部
    scrollToBottom() {
      if (!this.canLoad || this.loading) return
      this.params.page++
      this.getTableData()
    }
  },
  created() {
    this.getRoles()
    this.debounceSearch = debounce(300, this.searchMemeber)
  }
}
</script>

<style lang="scss" scoped>
  .nf-dialog {
    .right{
      max-height: 500px;
      overflow: auto;
    }
  }
  .left{
    .el-input{
      margin-bottom: 20px;
    }
  }
  .el-tag{
    margin-right: 20px;
    margin-bottom: 15px;
  }
</style>
