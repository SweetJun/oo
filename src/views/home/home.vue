<template>
  <div class="home">
    <el-row :gutter="10">
      <el-col :span="10">
        <div class="grid-content ">
          <!-- <p class="loginTime">上一次登录时间：2020-01-13 13:38:06</p> -->
          <div class="userInfo">
            <div class="userImg">
              <img src="@/assets/images/default-avatar.png" alt="">
            </div>
            <div class="userRight">
              <h2 class="name">你好，<span>{{ userInfo.name }}</span></h2>
              <p class="userWord">{{ soulWord }}</p>
              <!-- <div class="login-info">
                <p class="userAddr"> 登录地址：北京市 </p>
                <p class="userAddr"> 登录设备：电脑 </p>
              </div> -->
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div style="background-color: #fff;">
          <div class="grid-content weatherInfo">
            <div class="weatherLeft" v-if="weather.sk">
              <div class="weather-temp">
                <h3>{{weather.sk.temp}}℃</h3>
                <img :src='weather.today.img' alt="">
              </div>
              <p class="weatherCity">
                <span>{{weather.today.city}}</span>
                <span>{{weather.today.weather}}</span>
                <span class="line"></span>
                <span>{{weather.today.temperature}}</span>
              </p>
              <p class="weatherTime">天气更新时间：{{weather_time}}</p>
            </div>
            <div class="weatherRight"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="clearfix">
      <el-col :span="24">
        <div class="flow">
          <p class="title">业务流程</p>
          <div class="process-box">
            <div
              class="process"
              v-for="(line, index) in process"
              :key="index"
              :class="{' fist-line': index === 0, '': index === 1}">
              <div class="process-item" v-for="(item, $index) in line" :key="$index">
                <div class="img-txt" @click="itemClick(item)">
                  <img :src="item.img" alt="">
                  <p>{{ item.name }}</p>
                </div>
                <img src="@/assets/images/home/arrow.png" alt="" v-if="!item.arrowHidden">
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import VueJsonp from 'vue-jsonp'
import soulSoother from '@/assets/js/home.js'
Vue.use(VueJsonp)
import Recordingplan from '@/assets/images/home/Recordingplan.png'
// import peizai from '@/assets/images/home/peizai.png'
// import fpcyf from '@/assets/images/home/fpcyf.png'
import paiche from '@/assets/images/home/paiche.png'
import querenzhuanche from '@/assets/images/home/querenzhuanche.png'
import ztgl from '@/assets/images/home/ztgl.png'
// import sxyoujies from '@/assets/images/home/sxyoujies.png'
// import kaipiao from '@/assets/images/home/kaipiao.png'
// import duizhang from '@/assets/images/home/duizhang.png'
import jiashiyuanjies from '@/assets/images/home/jiashiyuanjies.png'
import huidan from '@/assets/images/home/huidan.png'
import jiaoche from '@/assets/images/home/jiaoche.png'
const process = [
  [
    { path: '/order/add', img: Recordingplan, name: '录计划' },
    // { path: '/home', img: peizai, name: '配载' },
    // { path: '/home', img: fpcyf, name: '分配承运方' },
    // { path: '/home', img: paiche, name: '派车' },
    { path: '/dispatch/add', img: paiche, name: '制作调度单' },
    { path: '/dispatchToLoadVehicle', img: querenzhuanche, name: '确认装车' },
    { path: '/dispatchOnTheWay', img: ztgl, name: '在途管理' },


    { path: '/dispatchToDeliveryVehicle', img: jiaoche, name: '交车' },
    { path: '/orderToReply', img: huidan, name: '回单' },
    { path: '/settlement/dispatchtoaddsettlementbill', img: jiashiyuanjies, name: '驾驶员结算', arrowHidden: true }
  ],
  [
    // { path: '/home', img: sxyoujies, name: '上下游结算' },
    // { path: '/home', img: kaipiao, name: '开票' },
    // { path: '/home', img: duizhang, name: '对账' },
  ]
]
export default {
  name: 'home',
  data() {
    return {
      weather: {},
      soulWord: '有事做有所期待，日子就是幸福的',
      weather_time: '',
      process: process
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  created() {
    // 首页心灵鸡汤
    this.soulWord = soulSoother[_.random(0, soulSoother.length - 1)]

    // 缓存当前时间和结果，间隔3个小时后再请求
    let current = new Date().getTime();
    if (!localStorage.OO_weather_data || Number(current) - Number(localStorage.OO_weather_time) > 10800000) {
      // 请求并缓存
      this.getWeather(current);
    } else {
      // 用缓存的数据
      this.weather = JSON.parse(localStorage.OO_weather_data);
    }
    this.weather_time = moment(parseInt(localStorage.OO_weather_time)).format("YYYY-MM-DD HH:mm:ss");
  },
  methods: {
    // 点击流程图，跳转
    itemClick(item) {
      this.$router.push(item.path)
    },
    // 天气接口
    getWeather(current) {
      // 缓存更新时间信息
      localStorage.OO_weather_time = current;
      // 请求
      let ip = returnCitySN["cip"]
      this.$jsonp(`//v.juhe.cn/weather/ip?format=2&key=bdce8e33846d4cf9ac6715591c48bb7a&ip=${ip}`, {
        callbackName: 'weatherFun',
        output: 'jsonp'
      }).then(data => {
        this.weather = data.result;
        let img = require(`@/assets/images/weather/${this.weather.today.weather_id.fb}.png`);
        this.$set(this.weather.today, 'img', img);
        // 缓存天气信息
        localStorage.OO_weather_data = JSON.stringify(this.weather);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  p,
  h3 {
    margin: 0;
    padding: 0;
  }
  .grid-content {
    background-color: #fff;
    border-radius: 4px;
    height: 295px;
    .loginTime {
      font-size: 14px;
      color: #787F95;
      padding-top: 25px;
      padding-left: 20px;
    }
  }
  .userInfo {
    display: flex;
    align-items: center;
    height: 100%;
    .userImg {
      width: 120px;
      min-width: 100px;
      height: 120px;
      border-radius: 50%;
      margin-left: 40px;
      vertical-align: middle;
      img{
        width: 100%;
      }
    }

    .userRight {
      padding: 0 20px 0 40px;
      .name{
        font-size: 20px;
        font-weight: bold;
      }
      h2 {
        font-size: 22px;
        color: #121C40;
        margin: 0;
        border: 0;
        font-weight: 400;
      }

      .userWord {
        font-size: 14px;
        color: #787F95;
        margin-top: 15px;
        line-height: 1.4;
      }
      .userAddr {
        font-size: 12px;
        color: #9FA5B6;
        margin-top: 10px;
      }
    }
    .login-info{
      margin-top: 25px;
    }
  }

  .weatherInfo {
    display: flex;
    align-items: center;
    position: relative;
    .weatherLeft {
      margin-left: 15%;
      margin-top: -15px;
      z-index: 5;
      img {
        width: 83px;
        height: 83px;
      }
    }
    .weatherCity {
      font-size: 16px;
      color: #121C40;
      span:not(:first-child){
        margin-left: 8px;
      }
      .line{
        display: inline-block;
        height: 8px;
        width: 2px;
        background-color: #D7DDE2;
      }
    }
    .weather-temp{
      display: flex;
      align-items: center;
      h3{
        font-size: 45px;
        display: inline-block;
        color: #001F56;
        margin-right: 10px;
      }
    }
    .weatherTime {
      margin-top: 10px;
      font-size: 12px;
      color: #787F95;
    }
    .weatherRight {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 728px;
      background: url('../../assets/images/home/home-right-background.png') no-repeat 50%;
      background-size: cover;
      overflow: hidden;
    }
  }
  .flow {
    margin-top: 10px;
    background-color: #fff;
    border-radius: 4px;
  }

  .process-img {
    width: 100%;
  }

  .process-title {
    margin: 20px 30px;
    text-align: left;
    font-size: 24px;
  }

  .process {
    display: flex;
  }

  .process-item {
    flex: 1;
    text-align: center;
    padding-right: 40px;
    position: relative;
  }

  .process-item>img {
    position: absolute;
    top: 50%;
    right: 8px;
  }

  .img-txt {
    text-align: center;
    background: #f9faff;
    border-radius: 5px;
    display: inline-block;
    width: 90px;
    padding-top: 10px;
    padding-bottom: 15px;
    cursor: pointer;
    transition: all .3s;
  }

  .img-txt:hover {
    background: #eff0f7;
  }

  .img-txt img {
    width: 38px;
  }

  .img-txt p {
    font-size: 14px;
    color: #333333;
    margin-top: 8px;
    margin-bottom: 0;
  }

  .fist-line {
    padding: 10px 0 35px;
  }

  .second-line {
    padding: 35px 0 10px;
  }

  .fist-line .process-item:last-child,
  .second-line .process-item:last-child {
    padding-right: 0;
  }

  .fist-line .process-item:last-child>img {
    bottom: -40px;
    top: auto;
    left: 50%;
    transform: translateX(-50%) rotateZ(90deg);
  }

  .second-line .process-item>img {
    transform: rotateZ(180deg);
  }

  .process-box {
    width: 80%;
    margin: 0 auto;
    padding: 50px 0 100px 0;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    padding: 20px 25px;
  }

</style>
