<template>
  <div class="report">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="cardHeader">
            <span class="title">按客户统计</span>
            <el-date-picker
              class="margin-l-10"
              v-model="clientDate"
              type="monthrange"
              value-format="yyyy-MM"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button
              class="margin-l-10"
              name="client-chart"
              type="primary"
              @click="updateClientChart">
              更新图表
            </el-button>
            <el-button
              name="client-print"
              type="success"
              :disabled="clientTotal === 0"
              @click="printEchart('client-chart', '客户统计')">
              打印
            </el-button>
          </div>
          <div class="echart-box" v-loading="clientLoading">
            <div id="client-chart" class="client-chart"></div>
            <div class="empty-text" v-if="clientTotal === 0">暂无数据</div>
            <div class="chart-bottom">
              <span class="total">总产值：{{clientTotal | toThousandFilter}}元</span>
              <span class="time">数据更新于：{{clientUpdateTime}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="cardHeader">
            <span class="title">按办事处统计</span>
            <el-date-picker
              class="margin-l-10"
              v-model="agencyDate"
              type="monthrange"
              value-format="yyyy-MM"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button
              class="margin-l-10"
              name="agency-chart"
              type="primary"
              @click="updateAgencyChart">
              更新图表
            </el-button>
            <el-button
              name="agency-print"
              type="success"
              :disabled="agencyTotal === 0"
              @click="printEchart('agency-chart', '办事处统计')">
              打印
            </el-button>
          </div>
          <div class="echart-box" v-loading="agencyLoading">
            <div id="agency-chart" class="agency-chart"></div>
            <div class="empty-text" v-if="agencyTotal === 0">暂无数据</div>
            <div class="chart-bottom">
              <span class="total">总产值：{{agencyTotal | toThousandFilter}}元</span>
              <span class="time">数据更新于：{{agencyUpdateTime}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <div slot="header" class="cardHeader">
        <span class="title">按价格类型统计</span>
        <el-date-picker
          class="margin-l-10"
          v-model="revenueDate"
          type="monthrange"
          value-format="yyyy-MM"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button
          class="margin-l-10"
          name="revenue-chart"
          type="primary"
          @click="updateRevenueChart">
          更新图表
        </el-button>
        <el-button
          name="revenue-print"
          type="success"
          :disabled="revenueTotal === 0"
          @click="printEchart('revenue-chart', '价格类型统计')">
          打印
        </el-button>
      </div>
      <div class="echart-box" v-loading="revenueLoading">
        <div id="revenue-chart" class="revenue-chart"></div>
        <div class="empty-text" v-if="revenueTotal === 0">暂无数据</div>
        <div class="chart-bottom">
          <span class="total">总产值：{{revenueTotal | toThousandFilter}}元</span>
          <span class="time">数据更新于：{{revenueUpdateTime}}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import colors from '@/assets/js/colors'
let clientChartOptions = {
  color: colors,
  title: {
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}：{c}元 ({d}%)'
  },
  legend: {
    type: 'scroll',
    left: 'center',
    top: 'bottom',
    data: []
  },
  noDataLoadingOption: {
    effect: "bubble",
    text: "暂无数据",
    effectOption: {
      effect: {
        n: 0
      }
    },
    textStyle: {
      fontSize: 32,
      fontWeight: 'bold'
    }
  },
  series: [
    {
      name: '客户',
      type: 'pie',
      radius: '55%',
      center: ['50%', '40%'],
      data: [],
      label: {
        formatter: '{b}：{d}%'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
let agencyChartOptions = {
  color: colors,
  tooltip: {
    trigger: 'item',
    formatter: '{b}：{c}元 ({d}%)'
  },
  legend: {
    type: 'scroll',
    left: 'center',
    top: 'bottom',
    data: []
  },
  series: [
    {
      name: '办事处',
      type: 'pie',
      radius: '55%',
      center: ['50%', '40%'],
      data: [],
      label: {
        formatter: '{b}：{d}%'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
let revenueChartOptions = {
  color: ['#4ecb73', '#409EFF'],
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: function (params) {
      let relVal = params[0].name;
      let total = _.round(_.sumBy(params, 'value'), 2)
      for (let i = 0, l = params.length; i < l; i++) {
        let item = params[i]
        let percent = total === 0 ? 0 : _.round((item.value / total * 100), 2)
        relVal += '<br/>' + item.marker + item.seriesName + '：' + item.value + ' 元 ' + '(' + percent + '%)'
      }
      return relVal;
    }
  },
  legend: {
    left: 'center',
    top: 'bottom',
    data: []
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '5%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: []
  }],
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '暂估',
    type: 'bar',
    barWidth: 50,
    stack: 'd',
    data: []
  },
  {
    name: '结算',
    type: 'bar',
    stack: 'd',
    data: []
  }]
}
export default {
  data() {
    return {
      clientDate: [],
      agencyDate: [],
      revenueDate: [],
      clientTotal: 0,
      clientUpdateTime: '',
      agencyTotal: 0,
      agencyUpdateTime: '',
      revenueTotal: 0,
      revenueUpdateTime: '',
      clientLoading: false,
      agencyLoading: false,
      revenueLoading: false
    }
  },
  methods: {
    /**
     * @Description: 根据数据渲染图表
     * @param  { Array } data 图表数据
     * @param  { Object } Echart 图表对象
     * @param  { String } type 图表类型
     * @param  { Object } options 图表配置对象
    **/
    initEchart(data, Echart, type, options) {
      let filterValue = data.filter(item => {
        if (Number(item.revenue) > 0) {
          return item
        }
      })
      let name = `${type}_name`
      options.legend.data = filterValue.map(item => item[name])
      options.series[0].data = filterValue.map(item => {
        return {
          value: item.revenue,
          name: item[name]
        }
      })
      Echart.setOption(options);
    },
    // 根据legend求总产值
    legendSelectChanged(params, chart_data, nameKey, totalName) {
      let valArr = []
      _.forIn(params.selected, (value, key) => {
        if (!value) return
        _.forEach(chart_data, item => {
          if (item[nameKey] === key) {
            valArr.push(item.revenue)
          }
        })
      })
      this[totalName] = _.round(_.sumBy(valArr), 2)
    },
    updateClientChart() {
      if (!this.clientDate) {
        this.$message.warning('请先选择时间')
        return
      }
      this.clientLoading = true
      $get(api.clientChart, {
        start_time: this.clientDate[0],
        end_time: this.clientDate[1]
      }).then(res => {
        this.clientLoading = false
        this.clientUpdateTime = moment().format("YYYY-MM-DD HH:mm:ss")
        let clientEchart = this.$echarts.init(document.getElementById("client-chart"))
        this.initEchart(res.chart_data, clientEchart, 'client', clientChartOptions)
        // 先选择legend再选择时间的问题兼容
        if (!this.clientParams) {
          this.clientTotal = _.round(_.sumBy(res.chart_data, 'revenue'), 2)
        } else {
          this.legendSelectChanged(this.clientParams, res.chart_data, 'client_name', 'clientTotal')
        }
        clientEchart.on('legendselectchanged', (params) => {
          this.clientParams = params
          this.legendSelectChanged(this.clientParams, res.chart_data, 'client_name', 'clientTotal')
        })
      })
    },
    updateAgencyChart() {
      if (!this.agencyDate) {
        this.$message.warning('请先选择时间')
        return
      }
      this.agencyLoading = true
      $get(api.agencyChart, {
        start_time: this.agencyDate[0],
        end_time: this.agencyDate[1]
      }).then(res => {
        this.agencyLoading = false
        this.agencyUpdateTime = moment().format("YYYY-MM-DD HH:mm:ss")
        let agencyEchart = this.$echarts.init(document.getElementById("agency-chart"))
        this.initEchart(res.chart_data, agencyEchart, 'agency', agencyChartOptions)
        // 先选择legend再选择时间的问题兼容
        if (!this.agencyParams) {
          this.agencyTotal = _.round(_.sumBy(res.chart_data, 'revenue'), 2)
        } else {
          this.legendSelectChanged(this.agencyParams, res.chart_data, 'agency_name', 'agencyTotal')
        }
        agencyEchart.on('legendselectchanged', (params) => {
          this.agencyParams = params
          this.legendSelectChanged(this.agencyParams, res.chart_data, 'agency_name', 'agencyTotal')
        })
      })
    },
    updateRevenueChart() {
      if (!this.revenueDate) {
        this.$message.warning('请先选择时间')
        return
      }
      this.revenueLoading = true
      $get(api.revenueTypeChart, {
        start_time: this.revenueDate[0],
        end_time: this.revenueDate[1]
      }).then(res => {
        this.revenueLoading = false
        this.revenueUpdateTime = moment().format("YYYY-MM-DD HH:mm:ss")
        let revenueEchart = this.$echarts.init(document.getElementById("revenue-chart"))
        revenueChartOptions.xAxis[0].data = _.map(res.chart_data, 'id')
        revenueChartOptions.series[0].data = []
        revenueChartOptions.series[1].data = []
        revenueChartOptions.legend.data = []
        let newArray = _.flatten((_.map(res.chart_data, 'revenue_types')))
        // 先选择legend再选择时间的兼容问题
        if (!this.revenueParams) {
          this.revenueTotal = _.round(_.sumBy(newArray, 'revenue'), 2)
        } else {
          let revenueArr = []
          _.forIn(this.revenueParams.selected, (value, key) => {
            if (value) {
              let targetArr = _.filter(_.flatten((_.map(res.chart_data, 'revenue_types'))), item => item.type_name === key)
              revenueArr = revenueArr.concat(targetArr)
            }
          })
          this.revenueTotal = _.round(_.sumBy(revenueArr, 'revenue'), 2)
        }
        if (this.revenueTotal > 0) {
          revenueChartOptions.legend.data = ['暂估', '结算']
          _.forEach(newArray, item => {
            if (item.type_name === '暂估') {
              revenueChartOptions.series[0].data.push(item.revenue)
            } else {
              revenueChartOptions.series[1].data.push(item.revenue)
            }
          })
        }
        revenueEchart.setOption(revenueChartOptions)
        // 动态计算总值
        revenueEchart.on('legendselectchanged', (params) => {
          this.revenueParams = params
          let revenueArr = []
          _.forIn(this.revenueParams.selected, (value, key) => {
            if (value) {
              let targetArr = _.filter(_.flatten((_.map(res.chart_data, 'revenue_types'))), item => item.type_name === key)
              revenueArr = revenueArr.concat(targetArr)
            }
          })
          this.revenueTotal = _.round(_.sumBy(revenueArr, 'revenue'), 2)
        })
      })
    },
    printEchart(id, title) {
      this.$print(id, title)
    }
  },
  mounted() {
    this.updateClientChart()
    this.updateAgencyChart()
    this.updateRevenueChart()
  },
  created() {
    const start = new Date()
    const end = new Date()
    start.setMonth(start.getMonth() - 11)
    let defaultDate = [moment(start).format('YYYY-MM'), moment(end).format('YYYY-MM')]
    this.clientDate = defaultDate
    this.agencyDate = defaultDate
    this.revenueDate = defaultDate
  }
}

</script>

<style lang="scss" scoped>
  .report {
    /deep/ .el-card__header {
      padding: 10px;
      .cardHeader {
        display: inline-block;
      }
    }
    .margin-l-10{
      margin-left: 10px;
    }
    .update{
      color: #303133;
      font-weight: 500;
    }
    .revenue-chart {
      width: 100%;
      height: 300px;
    }
    .client-chart,
    .agency-chart {
      width: 100%;
      height: 300px;
    }
  }
  .echart-box{
    position: relative;
  }
  .empty-text{
    position: absolute;
    padding: 10px;
    color: #909399;
    left: 50%;
    transform: translateX(-50%);
    top: 40%;
  }
  .cardHeader{
    .title{
      font-size: 16px;
    }
  }
  .el-row{
    margin-bottom: 10px;
  }
  .el-card /deep/{
    .el-card__body{
      padding: 10px;
    }
  }
  .chart-bottom{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .total{
      color: #333;
    }
    .time{
      color: #999;
    }
  }
</style>
