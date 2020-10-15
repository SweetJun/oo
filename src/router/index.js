import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, removeToken } from '@/utils/auth'

Vue.use(VueRouter)

let allRouter = require(process.env.NODE_ENV === 'production' ? './routes' : './routes');

let ROUTERS = allRouter.default;

const router = new VueRouter({
  mode: 'history',
  routes: ROUTERS
})

NProgress.configure({
  // 动画方式
  easing: 'ease',
  // 是否显示加载ico
  showSpinner: false,
  // 自动递增间隔
  trickleSpeed: 200,
  // 初始化时的最小百分比
  minimum: 0.3
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // 页面加载进度条
  if (to.name !== from.name) {
    NProgress.start()
  }
  window.document.title = to.meta.title ? `${to.meta.title} | OO运车` : 'OO运车';
  // 统一处理操作栏等非菜单点击跳转路由匹配
  let editTabs = store.state.layout.tabs
  if (to.path !== '/login') {
    let index = _.findIndex(editTabs, item => item.name === to.meta.activePath)
    if (index === -1 && to.meta.activePath) {
      editTabs.push({
        label: to.meta.tabTitle ? to.meta.tabTitle : to.meta.title,
        name: to.meta.activePath
      })
      store.commit('layout/updateTabs', editTabs)
    }
  }
  let isLogin = getToken();
  if (!isLogin) {
    // 没登录
    if (to.name !== 'login' && to.name !== 'three') {
      removeToken()
      let tags = [{
        label: '首页',
        name: '/home'
      }];
      localStorage.tags = JSON.stringify(tags);
      next('/login');
    } else {
      next();
    }
  } else if (to.name === 'login') {
    next('/');
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done()
});

export default router
