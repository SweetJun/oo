import Vue from 'vue'
import './plugins'
import App from './App.vue'
import router from './router'
import api from './api/api'
import { get, post, $delete, $put } from './api'
import store from './store/index'
import './assets/style/index.scss' // 全局css
import elDragDialog from './directives/el-drag-dialog' // 全局指令
import * as filters from './filters' // 全局过滤器
import mixin from './mixins' // 全局混入mixin
import search from '@/utils/pageType/search' // 每个页面搜索type

Vue.use(elDragDialog)

window.api = api
window.$get = get
window.$post = post
window.$put = $put
window.$delete = $delete
window.$search = search
//注册全局常用方法
import * as global from '@/utils/global'
Object.keys(global).forEach(item => {
  Vue.prototype[item] = global[item]
})

//注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

//注册全局mixin
Vue.mixin(mixin)

// 注册全局组件
const components = require.context('@/components', true, /index\.vue$/);
components.keys().forEach(item => {
  const fileItem = components(item).default;
  // 如果组件内定义name 则需要全局引用的
  if (fileItem.name) {
    Vue.component(fileItem.name, fileItem);
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
