<template>
  <div class="header">
    <div class="float-left header-left">
      <span
        class="collapse-icon iconfont iconSidenavigation1"
        @click="handleCollapseClick">
      </span>
      <span class="name">{{ company.value }}</span>
    </div>
    <div class="header-right float-right">
      <div class="help"><a class="link" target="_blank" href="/helper/mu-lu.html">帮助手册</a></div>
      <el-dropdown class="">
        <div class="el-dropdown-link">
          <el-avatar :src="avatar"></el-avatar>
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="toggleTheme">切换主题</el-dropdown-item>
          <!-- <el-dropdown-item @click.native="editPassword">修改密码</el-dropdown-item> -->
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// import { toggleClass } from '@/utils/utils'
import { removeToken } from '@/utils/auth'
import avatar from '@/assets/images/default-avatar.png'
export default {
  name: 'NfHeader',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      avatar: avatar
    }
  },
  computed: {
    company() {
      return this.$store.state.user.company;
    },
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods: {
    // 点击菜单缩起展开
    handleCollapseClick() {
      this.$store.commit('layout/updateCollapse', !this.isCollapse)
    },
    // 修改密码
    editPassword() {
      this.$message.warning('敬请期待')
    },
    // 切换主体
    toggleTheme() {
      const flag = document.body.classList.contains('custom-theme')
      let className = ''
      if (!flag) {
        className = 'custom-theme'
      }
      this.$vlf.setItem('theme', className).then(() => {
        if (className) {
          document.body.classList.add(className)
        } else {
          document.body.classList.remove('custom-theme')
        }
      })
    },
    // 退出
    logout() {
      $post(api.logout, {}).then(() => {
        localStorage.clear()
        sessionStorage.clear()
        removeToken()
        this.$store.commit('layout/updateTabs', [{ label: '首页', name: '/home' }])
        this.$router.push('/login')
      }).catch(() => {
        this.$message.warning('退出失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-left{
    line-height: 50px;
    .name{
      font-size: 15px;
    }
  }
  .header-right{
    height: 50px;
    width: 70%;
    display: flex;
    justify-content: flex-end;
  }
  .help{
    display: inline-block;
    padding: 0 20px;
    cursor: pointer;
    line-height: 50px;
    .link{
      text-decoration: none;
      color: #fff;
    }
  }
  .el-dropdown{
    cursor: pointer;
    .name{
      font-size: 13px;
      float: right;
      height: 50px;
      line-height: 50px;
      margin-left: 10px;
      color: #fff;
    }
  }
  .el-avatar{
    width: 28px;
    height: 28px;
    margin: 10px 0;
  }
  .el-badge{
    cursor: pointer;
    font-size: 20px;
    float: left;
    margin: 15px 25px 0 0;
    padding-right: 25px;
    &:hover{
      opacity: .8;
    }
    /deep/.el-badge__content{
      font-size: 12px;
      transform:scale(.8);
      left: 5px;
      top: -5px;
      right: auto;
    }
  }
  .collapse-icon{
    cursor: pointer;
    vertical-align: initial;
    margin-right: 20px;
    transition: .2s;
    border-radius: 50%;
    &:hover{
      opacity: .5;
    }
  }
</style>
