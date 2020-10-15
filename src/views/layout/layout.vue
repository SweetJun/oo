<template>
  <div style="height: 100%;">
    <el-container>
      <!-- 头部 -->
      <el-header style="height: 50px;">
        <nf-header :is-collapse="isCollapse"></nf-header>
      </el-header>

        <!-- 侧边栏 -->
      <div class="aside">
        <aside-menus
          :active-menu="activeMenu"
          :is-collapse="isCollapse"
          :aside-menus.sync="asideMenus">
        </aside-menus>
      </div>

      <!-- 主体内容 -->
      <el-main id="nucarf-main" :class="[isCollapse ? 'isCollapse' : '']">
        <el-tabs
          v-model="activeTab"
          type="card"
          @tab-remove="removeTab"
          @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(item, index) in editTabs"
            :key="index"
            :label="item.label"
            :name="item.name"
            :closable="item.label!='首页'">
          </el-tab-pane>
        </el-tabs>
        <el-scrollbar>
          <!-- 主体部分 -->
          <router-view class="nucarf-container" />

          <!--回到顶部-->
          <el-backtop target="#nucarf-main .el-scrollbar__wrap" bottom="60"></el-backtop>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import NfHeader from './components/header'
import AsideMenus from './components/asideMenus'
export default {
  components: {
    NfHeader,
    AsideMenus
  },
  data() {
    return {
      activeMenu: '',
      activeTab: '',
      asideMenus: []
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.layout.isCollapse;
    },
    editTabs() {
      return this.$store.state.layout.tabs;
    }
  },
  watch: {
    $route: {
      handler(val) {
        if (!val.meta.activePath) return
        // 对应菜单激活 menu
        this.activeMenu = val.meta.activePath
        // 对应标签激活 tabs
        this.activeTab = val.meta.activePath
      },
      immediate: true
    }
  },
  methods: {
    handleTabClick(tab) {
      if (tab.name === this.$route.path) return
      this.$router.push(tab.name)
    },
    // 移除tab
    removeTab(targetName) {
      let tabs = this.editTabs;
      let activeName = this.activeTab;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
        this.$router.push(activeName).catch(() => {})
      }
      this.activeTab = activeName;
      let updateTabs = tabs.filter(tab => tab.name !== targetName);
      this.$store.commit('layout/updateTabs', updateTabs)
    },
    // 获取用户信息
    getUserInfo() {
      $get(api.userLogin).then(res => {
        this.$store.commit('user/updateUserInfo', res)
      })
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style scoped lang="scss">
  .el-header /deep/{
    position: fixed;
    width: 100%;
    z-index: 1501;
    color: #fff;
    background-color: #2E3759;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
    p{
      margin: 0;
      line-height: 60px;
    }
  }
  .el-tabs /deep/{
    position: absolute;
    top: 50px;
    z-index: 10;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 2px 6px 0px #DFE3EA;
    .el-tabs__header{
      margin-bottom: 0;
      .el-tabs__item{
        border-bottom: 0;
      }
      .el-tabs__nav{
        border: 0;
        border-right: 1px solid #E4E7ED;
        border-radius: 0;
      }
    }
  }
  .el-menu:not(.el-menu--collapse){
    width: 220px;
  }

  .el-main{
    margin-left: 220px;
    padding: 0;
    overflow: hidden;
    padding-top: 90px;
    position: relative;
    transition: .3s margin-left ease-in-out;
    perspective: none;
    backface-visibility: hidden;
    &.isCollapse{
      margin-left: 64px;
    }
    /deep/.el-scrollbar__view{
      padding: 10px;
    }
  }
</style>
