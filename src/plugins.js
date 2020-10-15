import Vue from 'vue'
import echarts from 'echarts'
import Vlf from 'vlf'
import localforage from 'localforage'
import VueAMap from 'vue-amap' // 基于vue的高德地图
import 'normalize.css/normalize.css' // CSS reset
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer' // 图片预览vue组件
import Validation from '@/utils/validation' // 自定义验证插件


//基于 Vue 2.x 与高德的地图组件
setTimeout(()=>{
  localStorage.removeItem('_AMap_raster');
  Vue.use(VueAMap);
}, 10); // 防止刷新报错
VueAMap.initAMapApiLoader({
  // 申请的高德key
  key: 'c60251860b1288d77ec9d574123cf36c',
  // 插件集合
  plugin: [
    'AMap.PlaceSearch',
    'AMap.Geolocation',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.Autocomplete',
    'AMap.Geocoder',
    'AMap.OverView',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.MouseTool',
    'AMap.convertFrom',
    'AMap.GeometryUtil'
  ],
  v: '1.4.4'
})
localforage.config({
  name: 'OOyunche',
  version: 1.0,
  storeName: 'oo', // 仅接受字母，数字和下划线
  description: '本地存储自定义表头'
});
Vue.use(Viewer)
Vue.use(Vlf, localforage)
Vue.use(Validation)
Vue.prototype.$echarts = echarts
Vue.prototype._ = _
