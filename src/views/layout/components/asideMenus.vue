<template>
  <el-scrollbar class="left-scroll">
    <el-menu
      :collapse="isCollapse"
      :default-active="activeMenu"
      unique-opened>
      <el-menu-item index="/home" @click.native="handleSelect('/home', 'home')">
        <i class="iconfont iconxshouye"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <!-- 这里不能用div，否则折叠时文字不会折叠起来 -->
      <template v-for="(item, index) in vueMenus">
        <el-menu-item
          @contextmenu.native.prevent="contextmenuClick($event, defaultMenus[item.id].path, item)"
          v-if="!item.children && defaultMenus[item.id]"
          :index="defaultMenus[item.id].path"
          :key="index"
          @click.native="handleSelect(defaultMenus[item.id])">
          <i class="iconfont" :class="defaultMenus[item.id].icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
        <el-submenu class="nf-submenu" v-if="item.children && defaultMenus[item.id]" :index="item.name" :key="index">
          <template slot="title">
            <i class="iconfont" :class="defaultMenus[item.id].icon"></i>
            <span slot="title">{{item.name}}</span>
          </template>
          <template v-for="(child, index1) in item.children">
            <template v-if="!child.children && defaultMenus[item.id].children[child.id]">
              <el-menu-item
                @contextmenu.native.prevent="contextmenuClick($event, defaultMenus[item.id].children[child.id].path, child)"
                :key="index1"
                :index="defaultMenus[item.id].children[child.id].path"
                @click.native="handleSelect(defaultMenus[item.id].children[child.id])">
                <span slot="title">{{child.name}}</span>
              </el-menu-item>
            </template>
            <el-submenu
              :key="index1"
              :index="child.name"
              v-if="child.children">
              <span slot="title">{{child.name}}</span>
              <template v-for="(grandchild, index2) in child.children" >
                <el-menu-item
                  @contextmenu.native.prevent="contextmenuClick($event, defaultMenus[item.id].children[child.id].children[grandchild.id].path, grandchild)"
                  v-if="defaultMenus[item.id].children[child.id].children[grandchild.id]"
                  :key="index2"
                  :index="defaultMenus[item.id].children[child.id].children[grandchild.id].path"
                  @click.native="handleSelect(defaultMenus[item.id].children[child.id].children[grandchild.id])">
                  <span slot="title">{{grandchild.name}}</span>
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-submenu>
      </template>
    </el-menu>
    <nf-contextmenu class="nfRightMenu" :show-contextmenu.sync="showContextmenu">
       <ul slot="content" class="rightMenuBox">
         <li class="rightMenu" @click="rightClick()">在新标签页打开</li>
       </ul>
    </nf-contextmenu>
  </el-scrollbar>
</template>

<script>
import menus from '@/utils/vueMenus'
export default {
  props: {
    activeMenu: {
      type: String,
      default: '/'
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    asideMenus: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showContextmenu: false,
      blank_path: '',
      blank_name: '',
      router_path: '',
      defaultMenus: menus,
      vueMenus: [],
      leftMenus: []
    }
  },
  watch: {
    vueMenus: {
      handler(val) {
        let arr1 = val.filter(item => !item.children)
        let arr2 = [], arr3 = [];
        val.filter(item => item.children).forEach(item => {
          item.children.forEach(child => {
            arr2.push(child)
            if (child.children) {
              child.children.forEach(grandchild => {
                arr3.push(grandchild)
              })
            }
          })
        })
        this.leftMenus = [...arr1, ...arr2, ...arr3]
        this.$emit('update:asideMenus', this.leftMenus)
      },
      immediate: true
    }
  },
  methods: {
    // 右键菜单
    contextmenuClick(e, a, i) {
      this.blank_name = i.name
      this.blank_path = `${location.origin}${a}`
      this.router_path = a
      this.showContextmenu = true
      this.$nextTick(() => {
        document.querySelector('.nfRightMenu').style.position = 'fixed'
        document.querySelector('.nfRightMenu').style.top = e.clientY + 'px'
        document.querySelector('.nfRightMenu').style.left = e.clientX + 'px'
      })
    },
    // 右键菜单点击
    rightClick() {
      this.showContextmenu = false
      window.open(this.blank_path)
    },
    // 获取菜单
    getMenuList() {
      $get(api.menuList).then(res => {
        this.vueMenus = res
      })
    },
    // 点击菜单
    handleSelect(route, name) {
      let router = ''
      if (name === 'home') {
        router = {
          name: '首页',
          path: '/home'
        }
      } else {
        router = route
      }
      if (router.path === this.$route.path) return
      this.$router.push(router.path).catch(() => {})
    }
  },
  created() {
    this.getMenuList()
  }
}
</script>

<style lang="scss" scoped>
  .left-scroll{
    position: fixed;
    left: 0;
    top: 50px;
    bottom: 0;
    z-index: 1500;
    box-sizing: border-box;
    background-color: #2E3759;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  }
  .el-menu{
    border-right: 0;
    padding-bottom: 60px;
    &:not(.el-menu--collapse) {
      width: 220px;
    }
    .iconfont{
      margin-right: 18px;
      text-align: center;
      font-size: 16px;
      vertical-align: middle;
    }
  }
  .rightMenuBox{
    padding: 0 10px;
    text-align: center;
    .rightMenu{
      cursor: pointer;
    }
  }
</style>
