/**
 * path:'router-name'             跳转地址
 * name:'router-name'             如果用到<keep-alive>，必须设置该属性
 * meta : {
    title: 'title'                用于设置网页标签显示的标题
    activePath: '',               用于记录菜单活动状态
    keepAilve: true               是否缓存，默认 false
  }
 */

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/',
    name: 'Layout',
    redirect: '/home',
    component: () => import('@/views/layout/layout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/home'),
        meta: {
          title: '首页',
          activePath: '/home'
        }
      }
    ]
  },
  {
    path: '/three',
    name: 'three',
    component: () => import('@/views/login/three'),
    meta: {
      title: '首页',
      activePath: '/home'
    }
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404/404.vue'),
    meta: {
      activePath: '/404'
    }
  }
]

/** 当路由很多时，可以拆分成小模块 **/
// 自动导入Modules/ 模块
const customModuleFiles = require.context('./modules', true, /\.js$/)
customModuleFiles.keys().forEach(key => {
  customModuleFiles(key).default.forEach(route => {
    routes[1].children.push(route)
  })
});

export default routes
