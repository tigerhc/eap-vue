<template>
  <div class="app">
    <div id="kChart" />
    <div id="lineChart" />
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  components: {},
  data() {
    return {
      lineChart: [],
      time: []
    }
  },
  mounted() {
    this.kChart()
    // this.lChart()
  },
  methods: {
    kChart() {
      var chartDom = document.getElementById('kChart')
      var mycharts = echarts.init(chartDom)
      var option

      option = {
        xAxis: {
          data: [
            '2017-10-24',
            '2017-10-25',
            '2017-10-26',
            '2017-10-27',
            '2017-10-28',
            '2017-10-29',
            '2017-10-30',
            '2017-10-31'
          ]
        },
        yAxis: {},
        series: [
          {
            type: 'k',
            data: [
              [20, 34, 10, 38, 49, 38, 29, 34],
              [40, 35, 30, 50, 28, 59, 34, 56],
              [31, 38, 33, 44, 43, 28, 47, 36],
              [38, 15, 5, 42, 36, 37, 59, 35],
              [20, 34, 10, 38, 36, 27, 48, 25],
              [40, 35, 30, 50, 18, 36, 27, 19],
              [31, 38, 33, 44, 36, 31, 26, 12],
              [38, 15, 5, 42, 12, 34, 43, 12]
            ]
          }
        ]
      }
      mycharts.setOption(option)
      mycharts.on('click', (params) => {
        this.lineChart = params.data.slice(1)
        this.time.push(params.name)
        this.lChart(this.lineChart, this.time)
      })
    },
    lChart(data, time) {
      var chartDom = document.getElementById('lineChart')
      var mycharts = echarts.init(chartDom)
      var option
      option = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7', '8']
        },
        yAxis: {
          type: 'value'
        },
        // dataZoom: [
        //   {
        //     type: 'inside',
        //     start: 0,
        //     end: 20
        //   },
        //   {
        //     start: 0,
        //     end: 20
        //   }
        // ],
        series: [
          {
            data: data,
            type: 'line'
          }
        ]
      }
      mycharts.setOption(option)
    }
  }
}
</script>

<style  scoped>
#kChart,
#lineChart {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
</style>
