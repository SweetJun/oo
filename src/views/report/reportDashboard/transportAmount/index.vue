<template>
  <div class="report">
    <nf-form-wrap title="年度发运看板" :show-footer="false">
      <div class="cardHeader" slot="card-header">
        <nf-select class="margin-l-10" :value="year" :options="yearData" :placeholder="'请选择年份'"></nf-select>
        <el-button class="margin-l-10" type="primary">更新图表</el-button>
        <span class="margin-l-10 update">数据更新于2020-05-08 14:20:33</span>
      </div>
      <div id="elementid" class="elementid"></div>
    </nf-form-wrap>
    <nf-form-wrap class="wrap2" title="按承运类型统计" :show-footer="false">
      <div class="cardHeader" slot="card-header">
        <el-date-picker class="margin-l-10" v-model="value1" type="daterange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-button class="margin-l-10" type="primary">更新图表</el-button>
      </div>
      <div id="elementid2" class="elementid2"></div>
      <span>数据更新于2020-05-08 14:20:33</span>
    </nf-form-wrap>
    <nf-form-wrap class="wrap3" title="按办事处统计" :show-footer="false">
      <div class="cardHeader" slot="card-header">
        <el-date-picker class="margin-l-10" v-model="value1" type="daterange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-button class="margin-l-10" type="primary">更新图表</el-button>
      </div>
      <div id="elementid3" class="elementid3"></div>
      <span>数据更新于2020-05-08 14:20:33</span>
    </nf-form-wrap>
  </div>
</template>

<script>
export default {
  data() {
    const echartOptions = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['自有车', '大包', '合同外协', '短途', '现金卖板']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '自有车',
        type: 'line',
        stack: '总量',
        data: [26, 33, 30, 33, 45, 50, 56, 54, 50, 45, 35, 26]
      },
      {
        name: '大包',
        type: 'line',
        stack: '总量',
        data: [12, 13, 16, 18, 34, 45, 54, 57, 48, 45, 35, 26]
      },
      {
        name: '合同外协',
        type: 'line',
        stack: '总量',
        data: [18, 18, 19, 23, 29, 33, 55, 56, 47, 45, 35, 26]
      },
      {
        name: '短途',
        type: 'line',
        stack: '总量',
        data: [17, 19, 20, 23, 28, 39, 45, 56, 46, 44, 30, 25]
      },
      {
        name: '现金卖板',
        type: 'line',
        stack: '总量',
        data: [17, 19, 20, 23, 28, 39, 45, 56, 46, 44, 30, 25]
      }
      ]
    };

    const echartOptions2 = {
      color: ['rgb(245,212,100)', 'rgb(120,200,125)', 'rgb(93,161,248)', 'rgb(143,103,222)', 'rgb(227,111,126)'],
      title: {
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['中都', '安吉物流', '北京奔驰', '吉利', '一汽丰田']
      },
      series: [{
        name: '',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [{
          value: 335,
          name: '中都'
        },
        {
          value: 310,
          name: '安吉物流'
        },
        {
          value: 234,
          name: '北京奔驰'
        },
        {
          value: 135,
          name: '吉利'
        },
        {
          value: 1548,
          name: '一汽丰田'
        }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    const echartOptions3 = {
      color: ['rgb(245,212,100)', 'rgb(120,200,125)', 'rgb(93,161,248)', 'rgb(143,103,222)', 'rgb(227,111,126)'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['北京办事处', '天津办事处', '上海办事处', '重庆办事处', '南京办事处']
      },
      series: [{
        name: '',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [{
          value: 335,
          name: '北京办事处'
        },
        {
          value: 310,
          name: '天津办事处'
        },
        {
          value: 234,
          name: '上海办事处'
        },
        {
          value: 135,
          name: '重庆办事处'
        },
        {
          value: 1548,
          name: '南京办事处'
        }
        ]
      }]
    }
    setTimeout(() => {
      let Echart = this.$echarts.init(document.getElementById("elementid"));
      Echart.setOption(echartOptions);
      let Echart2 = this.$echarts.init(document.getElementById("elementid2"));
      Echart2.setOption(echartOptions2);
      let Echart3 = this.$echarts.init(document.getElementById("elementid3"));
      Echart3.setOption(echartOptions3);
    }, 100)
    return {
      storeModelName: 'clientIncomeModule',
      year: '',
      yearData: [{
        value: '2018年',
        key: 1
      },
      {
        value: '2019年',
        key: 2
      },
      {
        value: '2020年',
        key: 3
      }
      ]
    }
  },
  created() {},
  methods: {

  }
}

</script>

<style lang="scss" scoped>
  .report {
    /deep/ .el-card__header {
      padding: 10px 20px !important;

      .cardHeader {
        display: inline-block;
      }
    }

    .margin-l-10 {
      margin-left: 10px;
    }

    .update {
      color: #303133;
      font-weight: 500;
    }

    .elementid {
      width: 100%;
      height: 350px;
    }

    .wrap2,
    .wrap3 {
      float: left;
      margin-bottom: 20px;

      .elementid2,
      .elementid3 {
        width: 100%;
        height: 300px;
      }
    }

    .wrap2 {
      width: calc(50% - 10px);
      margin-right: 20px;
    }

    .wrap3 {
      width: calc(50% - 10px);
    }
  }

</style>
