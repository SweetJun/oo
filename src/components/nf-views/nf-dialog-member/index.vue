<template>
  <div>
    <!-- 添加成员 -->
    <nf-dialog
      class="nf-dialog"
      title="添加成员"
      :dialog-visible.sync="dialogMember"
      width="1000px"
      :disabled="selectMembers.length === 0"
      @close="dialogClose"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content flex" slot="content">
        <div class="left">
          <span class="span-title">请选择成员</span>
          <el-input
            placeholder="搜索员工"
            clearable
            size="medium"
            prefix-icon="el-icon-search"
            @input="inputChange"
            v-model="keyWorld">
          </el-input>
          <el-table
            ref="memberTable"
            class="memberTable"
            :data="memberData"
            max-height="455px"
            border
            size="mini"
            row-key="id"
            v-loading="loading"
            @select="handleSelectionChange"
            :show-header="false">
            <el-table-column prop="name" label="姓名" min-width="130"></el-table-column>
            <el-table-column prop="phone_no" label="手机号" min-width="100"></el-table-column>
            <el-table-column prop="role_name" label="职位" min-width="100"></el-table-column>
            <el-table-column type="selection" reserve-selection width="45"/>
            <div slot="append" class="append-last-row" v-if="!loading && memberData.length > 0">
              {{loadingTxt}}
            </div>
          </el-table>
        </div>
        <div class="right">
          <span class="span-title">已选择的成员</span>
          <div class="departments">
            <el-tag
              v-for="(item, index) in selectMembers"
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
// 选择员工组件
import { debounce } from 'throttle-debounce'
export default {
  name: 'nfDialogMember',
  props: {
    // store模块 名称
    storeModelName: {
      type: String,
      default: ''
    },
    dialogMember: {
      type: Boolean,
      default: false
    },
    apiUrl: {
      type: String,
      default: api.users
    },
    selectMembers: {
      type: Array,
      default: () => []
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
      memberData: []
    }
  },
  methods: {
    // 获取成员
    getMemebers() {
      this.loading = true
      let params = {
        pager: {
          page: this.params.page,
          per_page: this.params.per_page
        },
        condition: {
          user_name_mobile_text: {
            key: '',
            value: this.keyWorld
          }
        }
      }
      $get(this.apiUrl, params).then((res) => {
        if (res.data.length === 20) {
          this.canLoad = true
          this.loadingTxt = ''
        } else {
          this.canLoad = false
          this.loadingTxt = '已加载全部成员'
        }
        this.memberData = this.memberData.concat(res.data)
        this.loading = false
        this.$nextTick(() => {
          this.selectMembers.forEach(item => {
            let row = _.find(this.memberData, { id: item.id })
            if (row) {
              this.$refs['memberTable'].toggleRowSelection(row, true)
            } else {
              this.$refs['memberTable'].toggleRowSelection(item, true)
            }
          })
          // this.selectMembers.forEach(checkItem => {
          //   this.memberData.forEach(dataItem => {
          //     if (checkItem.id === dataItem.id) {
          //       this.$refs['memberTable'].toggleRowSelection(dataItem, true)
          //       return
          //     }
          //   })
          // })
        })
      })
    },
    inputChange() {
      this.params.page = 1
      this.debounceSearch()
    },
    searchMemeber() {
      this.memberData = []
      this.getMemebers()
    },
    // 选择人员
    handleSelectionChange(val) {
      this.selectMembers = val
    },
    // 删除人员
    handleClose(index) {
      this.$refs['memberTable'].toggleRowSelection(this.selectMembers[index], false)
      this.selectMembers.splice(index, 1)
    },
    // 确认添加人员
    clickSureBtn() {
      this.dialogMember = false
      this.$emit('update:dialogMember', false)
      this.$emit('handle-click-sure', this.selectMembers)
    },
    // 弹框关闭事件
    dialogClose() {
      this.dialogMember = false
      this.$emit('update:dialogMember', false)
    },
    // 滚动到底部
    scrollToBottom() {
      const container = this.container
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
        if (!this.canLoad) return
        this.params.page++
        this.getMemebers()
      }
    }
  },
  mounted() {
    this.container = document
    this.$nextTick(() => {
      let target = document.querySelector('.memberTable>.el-table__body-wrapper')
      if (target) {
        this.container = target
      }
      this.debounceScroll= debounce(200, this.scrollToBottom)
      this.container.addEventListener('scroll', this.debounceScroll)
    })
  },
  created() {
    this.getMemebers()
    this.debounceSearch = debounce(300, this.searchMemeber)
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.debounceScroll)
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
