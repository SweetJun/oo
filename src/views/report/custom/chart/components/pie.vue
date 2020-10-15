<template>
  <div class="report">
    <!-- 搜索 -->
    <nf-top-search
      v-if="searchData.length > 0"
      :search-data="searchData"
      :store-model-name="storeModelName"
      search-label-width="80px"
      :search-click="handleSearchClick">
    </nf-top-search>
    <div class="echart-box" v-loading="chartLoading">
      <div id="pie-chart" class="pie-chart"></div>
      <div class="empty-text" v-if="totalValue === 0">暂无数据</div>
      <div class="chart-bottom">
        <span class="total">总值：{{totalValue | toThousandFilter}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import colors from '@/assets/js/colors'
import { transfromForBackend, filterOutType } from '@/utils/transformSearchData'
let chartOptions = {
  color: colors,
  title: {
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}：{c} ({d}%)'
  },
  legend: {
    type: 'scroll',
    left: 'center',
    top: 'bottom',
    data: []
  },
  series: [
    {
      name: '',
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
export default {
  props: {
    storeModelName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      totalValue: 0,
      chartLoading: false,
      searchData: []
    }
  },
  computed: {
    currentRow() {
      return this.$store.state[this.storeModelName].currentRow
    }
  },
  methods: {
    // 根据legend求总产值
    legendSelectChanged(params, chart_data) {
      let valArr = []
      _.forIn(params.selected, (value, key) => {
        if (!value) return
        _.forEach(chart_data, item => {
          if (item.name === key) {
            valArr.push(item.value)
          }
        })
      })
      this.totalValue = _.round(_.sumBy(valArr), 2)
    },
    initChart(condi = {}) {
      this.chartLoading = true
      let params = {
        extra_params: {}
      }
      let condition = transfromForBackend(condi)
      let _condition = filterOutType(condition)
      params.condition = _condition.condition
      let apiUrl = `${api.customChartView}/${this.currentRow.id}/data`
      $get(apiUrl, params).then(res => {
        this.chartLoading = false
        const chartData = res.chart_data
        let pieEchart = this.$echarts.init(document.getElementById("pie-chart"))
        let filterValue = chartData.filter(item => {
          if (Number(item.value) > 0) {
            return item
          }
        })
        chartOptions.legend.data = filterValue.map(item => item.name)
        chartOptions.series[0].data = filterValue
        pieEchart.setOption(chartOptions)

        // 先选择legend再选择搜索条件的问题兼容
        if (!this.pieParams) {
          this.totalValue = _.round(_.sumBy(chartData, 'value'), 2)
        } else {
          this.legendSelectChanged(this.pieParams, chartData)
        }
        pieEchart.on('legendselectchanged', (params) => {
          this.pieParams = params
          this.legendSelectChanged(this.pieParams, chartData)
        })
      })
    },
    // 获取搜索数据
    getSearchData() {
      $get(`${api.customChartView}/${this.currentRow.id}/metadata`).then(res => {
        this.searchData = res.search_items
      })
    },
    handleSearchClick(condition) {
      this.initChart(condition)
    },
    printEchart(id, title) {
      this.$print(id, title)
    }
  },
  created() {
    this.getSearchData()
    this.initChart()
  }
}

</script>

<style lang="scss" scoped>
  .pie-chart {
    width: 100%;
    height: 400px;
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
