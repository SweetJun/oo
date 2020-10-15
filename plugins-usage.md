/* eslint-disable */
// 所用插件的使用方法（简单示例）
/**
 * @Description: Lodash 对 array、number、objects、string 等的操作
 * address：https://www.lodashjs.com/docs/latest
 */

/**
 * @Description: moment 日期处理类库
 * address：http://momentjs.cn/docs/
 * @param : param 时间戳等，不传为当前时间
 */
this.nowTime = moment(param).format("YYYY-MM-DD HH:mm:ss");

/**
 * @Description: echarts 图表工具
 * address：https://www.echartsjs.com/zh/api.html#echarts
 * @param : echartOptions 配置项
 */
const echartOptions = {
  tooltip: {
    trigger: "item",
    formatter: "{b}"
  },
  series: [
    {
      type: "pie",
      radius: "55%",
      center: ["50%", "50%"],
      data: [],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};
let Echart = this.$echarts.init(document.getElementById("elementid"));
Echart.setOption(echartOptions);

/**
 * @Description: vue-amap vue 高德地图组件
 * address：https://elemefe.github.io/vue-amap/#/zh-cn/introduction/quick-start
 */
/* eslint-disable */
// import { lazyAMapApiLoaderInstance } from "vue-amap";
lazyAMapApiLoaderInstance.load().then(() => {
  // your code ...
  this.map = new AMap.Map("amapContainer", {
    center: new AMap.LngLat(121.59996, 31.197646)
  });
});
/* eslint-disable */
/**
 * @Description: v-viewer 用于图片浏览的Vue组件，支持旋转、缩放、翻转等操作
 * address：https://mirari.cc/v-viewer/
 */
// 以指令形式使用
// <div class="images" v-viewer="{movable: false}">
//   <img v-for="src in images" :src="src" :key="src">
// </div>
// 以组件形式使用
// <viewer :options="options" :images="images" class="viewer" ref="viewer">
//   <template scope="scope">
//     <img v-for="src in scope.images" :src="src" :key="src">
//   </template>
// </viewer>

/* eslint-disable */
